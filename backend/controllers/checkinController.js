const pool = require('../config/db');

// 签到
exports.checkin = async (req, res) => {
  try {
    // 1. 从请求体里获取 pet_id
    const { pet_id } = req.body;
    // 2. 从 Token 里获取用户ID
    const user_id = req.user.userId;

    // 3. 校验必填字段
    if (!pet_id || !user_id) {
      return res.status(400).json({ success: false, message: 'pet_id 和 user_id 不能为空' });
    }

    // 4. 执行签到 SQL，确保参数正确
    const [result] = await pool.execute(
      `INSERT INTO pet_checkin (pet_id, user_id, checkin_time, status)
      VALUES (?, ?, NOW(), 'checked_in')`,
      [pet_id, user_id] // 这里的参数顺序必须和 SQL 里的字段顺序一致
    );

    res.status(200).json({
      success: true,
      message: '签到成功',
      data: { checkin_id: result.insertId, pet_id }
    });
  } catch (error) {
    console.error('签到错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};