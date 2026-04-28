const express = require('express');
const cors = require('cors');
const db = require('./config/db.js');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 测试路由
app.get('/', (req, res) => {
  res.send('毕设服务器运行正常！');
});

// 直接写注册接口（不依赖任何外部文件）
app.post('/api/users/register', (req, res) => {
    console.log("收到注册请求：", req.body);
    res.json({
        code: 201,
        message: '✅ 注册接口通了！',
        receivedData: req.body
    });
});

// 直接写登录接口
app.post('/api/users/login', (req, res) => {
    console.log("收到登录请求：", req.body);
    res.json({
        code: 200,
        message: '✅ 登录接口通了！',
        receivedData: req.body
    });
});

// 数据库连接测试（放在最前面）
db.getConnection().then(() => {
  console.log('✅ MySQL数据库连接成功！');
}).catch((err) => {
  console.log('❌ 数据库连接失败：', err);
});

// 启动服务器（必须放在所有路由之后！）
app.listen(PORT, () => {
  console.log(`✅ 服务器已启动：http://localhost:${PORT}`);
});