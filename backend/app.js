const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { JWT_SECRET } = require('./middleware/auth.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL连接成功');
    conn.release();
  })
  .catch(err => console.error('❌ MySQL连接失败:', err));

app.post('/api/user/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    const [existingUser] = await pool.execute(
      `SELECT * FROM user WHERE username = ?`,
      [username]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      `INSERT INTO user (username, password, email) VALUES (?, ?, ?)`,
      [username, hashedPassword, email || null]
    );

    res.status(201).json({ message: '注册成功', userId: result.insertId });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '注册失败' });
  }
});

app.post('/api/user/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    const [users] = await pool.execute(
      `SELECT * FROM user WHERE username = ?`,
      [username]
    );
    if (users.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: '登录成功',
      token: token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '登录失败' });
  }
});

const petRouter = require('./routes/pet');
app.use('/api/pet', petRouter);

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});