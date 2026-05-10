const jwt = require('jsonwebtoken');
// 和登录接口里的密钥保持一致
const JWT_SECRET = 'pet-pass-secret-key-2026';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '未登录或Token无效' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // 这里给 req.user 赋值 userId，和控制器里的字段名完全对应
        req.user = { userId: decoded.userId };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token验证失败，请重新登录' });
    }
};

module.exports = { verifyToken };