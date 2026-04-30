const jwt = require('jsonwebtoken');

const JWT_SECRET = 'pet-pass-secret-key-2026';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未登录或Token无效' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token验证失败，请重新登录' });
  }
};

module.exports = { authMiddleware, JWT_SECRET };