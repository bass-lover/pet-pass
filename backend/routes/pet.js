const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// 宠物注册接口
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { pet_name, type, age, description } = req.body;
    const user_id = req.user.userId || req.user.id;

    // 校验必填字段
    if (!pet_name || !type || !user_id) {
      return res.status(400).json({ message: '宠物名字、类型和用户ID不能为空' });
    }

    // 执行插入SQL
    const [result] = await pool.execute(
      `INSERT INTO pet (pet_name, type, age, description, user_id, status)
      VALUES (?, ?, ?, ?, ?, 'checked_out')`,
      [pet_name, type, age, description, user_id]
    );

    res.status(201).json({
      message: '宠物信息创建成功',
      petId: result.insertId
    });
  } catch (error) {
    console.error('宠物注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 查询用户自己的宠物列表接口
router.get('/my', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.userId;

    const [pets] = await pool.execute(
      `SELECT id, pet_name, type, age, description, status
       FROM pet
       WHERE user_id = ?
       ORDER BY id DESC`,
      [user_id]
    );

    return res.status(200).json({
      success: true,
      message: '반려견 목록 조회 성공',
      data: pets
    });
  } catch (error) {
    console.error('반려견 목록 조회 오류:', error);
    return res.status(500).json({
      success: false,
      message: '반려견 목록 조회 중 서버 오류가 발생했습니다.'
    });
  }
});

module.exports = router;