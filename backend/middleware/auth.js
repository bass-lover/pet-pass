const jwt = require('jsonwebtoken');
const JWT_SECRET = 'pet-pass-secret-key-2026'; // 用你之前调通的密钥

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '토큰이 없습니다.' // 未登录
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // 直接把解码后的用户信息挂到 req 上
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '유효하지 않은 토큰입니다.' // Token无效
    });
  }
};

// 管理员权限验证（如果需要的话）
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: '관리자 권한이 필요합니다.'
    });
  }
};

module.exports = { verifyToken, verifyAdmin };