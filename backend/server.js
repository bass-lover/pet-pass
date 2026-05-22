const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3001;

// 解析 JSON 请求体
app.use(express.json());// JWT 验证中间件
const authMiddleware = async (req, res, next) => {
  try {
    // 从请求头获取 Token（格式：Bearer <token>）
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 401,
        message: '请先登录'
      });
    }

    const token = authHeader.split(' ')[1];
    // 验证 Token 有效性
    const decoded = jwt.verify(token, SECRET_KEY);
    // 把用户信息挂载到 req 上，方便后续接口使用
    req.user = decoded;
    next(); // 放行到下一个接口
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: 'Token 无效或已过期'
    });
  }
};

// 示例：需要登录才能访问的接口（获取当前用户信息）
app.get('/api/users/me', authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, email, nickname, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    res.status(200).json({
      code: 200,
      message: '获取用户信息成功',
      data: users[0]
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 数据库连接配置（按你自己的情况修改密码）
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',          // 改成你自己的 MySQL 密码
  database: 'animal_park',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 注册接口（完整版）
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    // 1. 检查必填字段
    if (!email || !password || !nickname) {
      return res.status(400).json({
        code: 400,
        message: '邮箱、密码和昵称不能为空'
      });
    }

    // 2. 检查邮箱是否已被注册
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(409).json({
        code: 409,
        message: '该邮箱已被注册'
      });
    }

    // 3. 密码加密（bcrypt）
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. 写入数据库
    const [result] = await pool.query(
      'INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)',
      [email, hashedPassword, nickname]
    );

    // 5. 返回成功响应
    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: {
        id: result.insertId,
        email,
        nickname
      }
    });

  } catch (error) {
    console.error('注册失败的详细错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误，注册失败',
      error: error.message
    });
  }
});

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key-keep-it-safe'; // 建议改成复杂的随机字符串

// 登录接口
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. 只校验登录需要的字段：邮箱和密码
    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        message: '邮箱和密码不能为空'
      });
    }

    // 2. 检查用户是否存在
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({
        code: 401,
        message: '邮箱或密码错误'
      });
    }
    const user = users[0];

    // 3. 验证密码（bcrypt.compare 会把明文和加密后的哈希做对比）
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '邮箱或密码错误'
      });
    }

    // 4. 生成JWT Token（有效期1小时）
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // 5. 返回成功响应（不返回密码，只返回用户信息和token）
    res.status(200).json({
      code: 200,
      message: '登录成功',
      data: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        token: token
      }
    });

  } catch (error) {
    console.error('登录失败的详细错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误，登录失败',
      error: error.message
    });
  }
});
// 兜底 404
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: `接口 ${req.method} ${req.path} 不存在`
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`✅ 服务器启动成功！地址：http://localhost:${PORT}`);
});