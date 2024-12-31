import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
};

export const checkAdmin = (req, res, next) => {
    if (req.headers.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};
export const checkHost = (req, res, next) => {
    if (req.headers.role !== 'host') {
        return res.status(403).json({ message: 'Access denied: Hosts only' });
    }
    next();
};