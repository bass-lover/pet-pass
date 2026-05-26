const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const pool = require('../config/db');

// 签到接口（兼容 id 和 userId 两种字段）
router.post('/checkin', verifyToken, async (req, res) => {
  try {
    const { pet_id } = req.body;
    // 关键修复：同时兼容 id 和 userId
    const user_id = req.user.userId || req.user.id;

    if (!pet_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'pet_id 和 user_id 不能为空'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO pet_checkin (pet_id, user_id, checkin_time, status)
      VALUES (?, ?, NOW(), 'checked_in')`,
      [pet_id, user_id]
    );

    res.status(200).json({
      success: true,
      message: '签到成功',
      data: { checkin_id: result.insertId, pet_id }
    });
  } catch (error) {
    console.error('签到错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// 签退接口（同样兼容两种字段）
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { pet_id } = req.body;
    const user_id = req.user.userId || req.user.id;

    if (!pet_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'pet_id 和 user_id 不能为空'
      });
    }

    const [result] = await pool.execute(
      `UPDATE pet_checkin 
      SET checkout_time = NOW(), status = 'checked_out'
      WHERE pet_id = ? AND status = 'checked_in'`,
      [pet_id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: '未找到有效的签到记录，无法签退'
      });
    }

    res.status(200).json({
      success: true,
      message: '签退成功'
    });
  } catch (error) {
    console.error('签退错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

module.exports = router;