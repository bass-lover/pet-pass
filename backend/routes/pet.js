const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

// 반려견 등록
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { pet_name, type, age, description } = req.body;
    const user_id = req.user.userId;

    if (!pet_name || !type) {
      return res.status(400).json({
        success: false,
        message: '반려견 이름과 종류를 입력해주세요.',
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO pet (user_id, pet_name, type, age, description) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, pet_name, type, age || null, description || null]
    );

    return res.status(201).json({
      success: true,
      message: '반려견 정보가 등록되었습니다.',
      petId: result.insertId,
    });
  } catch (error) {
    console.error('반려견 등록 오류:', error);
    return res.status(500).json({
      success: false,
      message: '반려견 등록 처리 중 서버 오류가 발생했습니다.',
    });
  }
});

// 내 반려견 목록 조회
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
      data: pets,
    });
  } catch (error) {
    console.error('반려견 목록 조회 오류:', error);
    return res.status(500).json({
      success: false,
      message: '반려견 목록 조회 중 서버 오류가 발생했습니다.',
    });
  }
});

module.exports = router;
