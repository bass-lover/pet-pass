const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pet-pass-secret-key-2026';

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '토큰이 없습니다.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '유효하지 않은 토큰입니다.',
    });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '로그인이 필요합니다.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '관리자만 접근할 수 있습니다.',
    });
  }

  next();
};

module.exports = {
  JWT_SECRET,
  verifyToken,
  verifyAdmin,
};