const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Get the token from the request header: "Bearer <token>"
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No authorization token, access denied'});
    }

    const token = authHeader.split(' ')[1];

    try{
        // 2. Verify token using our JWT_SECRET from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //{id: user._id, role: user.role }
        next(); //Pass control to the next handler
    } catch (err) {
        return res.status(401).json({ message: 'Token is invalid or expired'});
    }
};

module.exports = authMiddleware;