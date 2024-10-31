// middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
    // تحقق من الـ Admin أو من هو المستخدم
    const isAdmin = true; // تحقق من صلاحيات المستخدم
    if (!isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

module.exports = authMiddleware;
