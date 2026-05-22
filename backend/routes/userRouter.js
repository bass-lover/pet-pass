const express = require('express');
const router = express.Router();

// 只写一个测试注册接口
router.post('/register', (req, res) => {
    res.json({
        code: 201,
        message: '测试注册成功！',
        data: req.body
    });
});

// 测试登录接口
router.post('/login', (req, res) => {
    res.json({
        code: 200,
        message: '测试登录成功！',
        data: req.body
    });
});

// 必须放在文件最后！！！
module.exports = router;