const cron = require('node-cron');
const db = require('../db'); // 确认你的数据库连接文件路径正确

const autoCheckoutTask = () => {
 cron.schedule('0 0 2 * * *', async () => {
    console.log('⏰ 开始执行自动签退任务...');
    let connection;
    try {
      // 1. 获取数据库连接并开启事务
      connection = await db.getConnection();
      await connection.beginTransaction();

      // 2. 计算12小时前的时间
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      console.log('📅 12小时前的时间:', twelveHoursAgo);

      // 3. 查询超过12小时未签退的记录（用 checkin_id，不是 id）
      const [records] = await connection.query(
        `SELECT checkin_id, pet_id FROM pet_checkin 
         WHERE status = 'checked_in' AND created_at < ?`,
        [twelveHoursAgo]
      );

      console.log('🔍 查询到的记录:', records);

      if (records.length === 0) {
        console.log('✅ 没有需要自动签退的记录');
        await connection.commit();
        return;
      }

      // 4. 更新签退记录（用 checkin_id，加上 checkout_type）
      const recordIds = records.map(r => r.checkin_id);
      await connection.query(
        `UPDATE pet_checkin 
         SET status = 'checked_out', checkout_time = NOW(), checkout_type = 'auto' 
         WHERE checkin_id IN (?)`,
        [recordIds]
      );

      // 5. 更新宠物状态为已离园
      const petIds = records.map(r => r.pet_id);
      await connection.query(
        `UPDATE pet 
         SET status = 'checked_out' 
         WHERE id IN (?)`,
        [petIds]
      );

      await connection.commit();
      console.log(`✅ 成功自动签退 ${records.length} 条记录`);
    } catch (err) {
      if (connection) await connection.rollback();
      console.error('❌ 自动签退任务失败:', err);
    } finally {
      if (connection) connection.release();
    }
  });
};

module.exports = autoCheckoutTask;