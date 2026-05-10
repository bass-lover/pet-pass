const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');
const { verifyToken } = require('../middleware/auth');

router.post('/checkin', verifyToken, checkinController.checkin);
router.post('/checkout', verifyToken, checkinController.checkout);
router.get('/status/:petId', verifyToken, checkinController.getCheckinStatus);

module.exports = router;