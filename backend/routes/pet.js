const express = require('express');
const router = express.Router();
const pool = require('../config/db');
// 这里已经改成了正确的名字 verifyToken
const { verifyToken } = require('../middleware/auth');

// 宠物注册接口
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { pet_name, type, age, description } = req.body;
    // 1. 修正：用 req.user.userId，和 auth.js 里赋值的字段对应
    const user_id = req.user.userId || req.user.id; // 兼容两种写法，避免再出错

    // 2. 校验必填字段
    if (!pet_name || !type || !user_id) {
      return res.status(400).json({ message: '宠物名字、类型和用户ID不能为空' });
    }

    // 3. 所有可能为 undefined 的字段，用 ?? null 兜底，传给 MySQL
    const [result] = await pool.execute(
      `INSERT INTO pet (user_id, pet_name, type, age, description)
      VALUES (?, ?, ?, ?, ?)`,
      [
        user_id,
        pet_name,
        type,
        age ?? null,
        description ?? null
      ]
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