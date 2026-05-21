const db = require('./db'); // 你的数据库连接文件路径

async function testAutoCheckout() {
  console.log('手动执行自动签退逻辑...');
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    console.log('12小时前的时间:', twelveHoursAgo);
    console.log('查询条件: created_at < ?', twelveHoursAgo);

    const [records] = await connection.query(
  `SELECT checkin_id, pet_id FROM pet_checkin 
   WHERE status = 'checked_in' AND created_at < ?`,
  [twelveHoursAgo]
);

    console.log('查询到的记录:', records);

    if (records.length === 0) {
      console.log('没有需要处理的记录');
      await connection.commit();
      return;
    }

    const recordIds = records.map(r => r.id);
    await connection.query(
  `UPDATE pet_checkin 
   SET status = 'checked_out', checkout_time = NOW(), checkout_type = 'auto' 
   WHERE checkin_id IN (?)`,
  [recordIds]
);

    const petIds = records.map(r => r.pet_id);
    await connection.query(
      `UPDATE pet 
       SET status = 'checked_out' 
       WHERE id IN (?)`,
      [petIds]
    );

    await connection.commit();
    console.log(`成功处理 ${records.length} 条记录`);
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('执行失败:', err);
  } finally {
    if (connection) connection.release();
  }
}

testAutoCheckout();