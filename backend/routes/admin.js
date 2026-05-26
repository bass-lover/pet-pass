const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// 현재 공원 이용 중인 반려견 수 조회
router.get(
  '/current-pets',
  verifyToken,
  verifyAdmin,
  adminController.getCurrentPets
);

// 체크인/체크아웃 기록 조회
router.get(
  '/check-records',
  verifyToken,
  verifyAdmin,
  adminController.getCheckRecords
);

module.exports = router;
