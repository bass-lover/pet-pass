const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', authMiddleware, async (req, res) => {
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
      message: '宠物信息注册成功',
      petId: result.insertId
    });
  } catch (error) {
    console.error('宠物注册错误:', error);
    res.status(500).json({ message: '服务器错误，注册失败' });
  }
});

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;

    const [pets] = await pool.execute(
      `SELECT id, pet_name, type, age, description, create_time 
       FROM pet WHERE user_id = ?`,
      [user_id]
    );

    res.status(200).json({
      message: '查询成功',
      pets: pets
    });
  } catch (error) {
    console.error('查询宠物错误:', error);
    res.status(500).json({ message: '服务器错误，查询失败' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const pet_id = req.params.id;

    const [pet] = await pool.execute(
      `SELECT id, pet_name, type, age, description, create_time 
       FROM pet WHERE id = ? AND user_id = ?`,
      [pet_id, user_id]
    );

    if (pet.length === 0) {
      return res.status(404).json({ message: '未找到该宠物信息或无权限查看' });
    }

    res.status(200).json({
      message: '查询成功',
      pet: pet[0]
    });
  } catch (error) {
    console.error('查询宠物详情错误:', error);
    res.status(500).json({ message: '服务器错误，查询失败' });
  }
});

module.exports = router;