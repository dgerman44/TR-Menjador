import jwt from 'jsonwebtoken';
import { cfg } from '../../config.js';

export const ensureAuth = function (req, res, next) {
    // passport will create a user object in the request
    // after successful authentication, and will put it 
    // there in all requests until logout.
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

export const ensureToken = function (req, res, next) {
    const token = tokenFromRequest(req);
    if (!token) return res.status(403).json({
        message: 'Missing token'
    });
    try {
        const jwt_payload = jwt.verify(token, cfg.jwtAuth.JWT_SECRET);
        req.token = token;
        next();
    } catch (err) {
        return res.status(403).json({
            message: 'Invalid token'
        });
    }
};

export const tokenFromRequest = function (req) {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) return null;
    const parts = bearerHeader.split(' ');
    if (parts.length < 2) return null;
    const bearerToken = parts[1];
    return bearerToken;
}