const express = require('express');
const router = express.Router();

const {
  checkin,
  checkout,
  getCheckinStatus,
  getMyCheckRecords,
} = require('../controllers/checkinController');

const { verifyToken } = require('../middleware/auth');

// 체크인
router.post('/checkin', verifyToken, checkin);

// 체크아웃
router.post('/checkout', verifyToken, checkout);

// 특정 반려견의 현재 체크인 상태 조회
router.get('/status/:petId', verifyToken, getCheckinStatus);

// 로그인한 사용자의 이용 기록 조회
router.get('/my-records', verifyToken, getMyCheckRecords);

module.exports = router;
