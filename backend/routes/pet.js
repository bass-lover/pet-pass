const express = require('express');
const router = express.Router();
const pool = require('../db');
// 这里已经改成了正确的名字 verifyToken
const { verifyToken } = require('../middleware/auth');

// 宠物注册接口
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { pet_name, type, age, description } = req.body;
    const user_id = req.user.id;

    if (!pet_name || !type) {
      return res.status(400).json({ message: '宠物名字和类型不能为空' });
    }

    const [result] = await pool.execute(
      `INSERT INTO pet (user_id, pet_name, type, age, description)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, pet_name, type, age || null, description || null]
    );

    res.status(201).json({
      message: '宠物信息创建成功',
      petId: result.insertId
    });
  } catch (error) {
    console.error('宠物注册错误:', error);
    res.status(500).json({ message: '宠物注册失败' });
  }
});

// 其他宠物接口...

module.exports = router;