const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const pool = require('./db');
const { JWT_SECRET, getUserRole } = require('./middleware/auth.js');
const autoCheckoutTask = require('./cron/autoCheckout');

const app = express();
const PORT = 3001;

// 자동 체크아웃 작업 실행
autoCheckoutTask();

app.use(cors());
app.use(express.json());

// DB 연결 확인
pool.getConnection()
  .then((conn) => {
    console.log('✅ MySQL 연결 성공');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ MySQL 연결 실패:', err);
  });

// 관리자 라우터
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// 회원가입
app.post('/api/user/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '아이디와 비밀번호를 입력해주세요.',
      });
    }

    const [existingUser] = await pool.execute(
      'SELECT * FROM user WHERE username = ?',
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 아이디입니다.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO user (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    return res.status(500).json({
      success: false,
      message: '회원가입 처리 중 서버 오류가 발생했습니다.',
    });
  }
});

// 로그인
app.post('/api/user/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '아이디와 비밀번호를 입력해주세요.',
      });
    }

    const [users] = await pool.execute(
      'SELECT * FROM user WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    const role = getUserRole(user.username);

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role,
      },
      JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );

    return res.status(200).json({
      success: true,
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        username: user.username,
        role,
      },
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    return res.status(500).json({
      success: false,
      message: '로그인 처리 중 서버 오류가 발생했습니다.',
    });
  }
});

// 반려견 라우터
const petRouter = require('./routes/pet');
app.use('/api/pet', petRouter);

// 체크인 라우터
const checkinRouter = require('./routes/checkin');
app.use('/api/checkin', checkinRouter);

// 기본 확인용 라우트
app.get('/', (req, res) => {
  res.send('Pet Pass backend server is running.');
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
