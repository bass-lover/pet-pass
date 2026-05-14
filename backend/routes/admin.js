const express = require('express');
const router = express.Router();
// 控制器引用（确保路径和文件名完全匹配）
const adminController = require('../controllers/adminController');

// 1. 当前在园宠物数量接口
router.get('/current-pets', adminController.getCurrentPets);

// 2. 签到记录查询接口
router.get('/check-records', adminController.getCheckRecords);

module.exports = router;