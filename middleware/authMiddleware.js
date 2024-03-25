import jwt from "jsonwebtoken";
import User from '../models/userModel.js';

function authMiddleware(req, res, next) {
    const authorizarionHeader = req.headers.authorization;
    if (typeof authorizarionHeader === 'undefined') {
        return res.status(401).json({ message: 'Authorization header is missing' });
    };
    const [bearer, token] = authorizarionHeader.split(" ", 2);
    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Invalid authorization header format' });
    };
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: 'Token expired error.' });
            };
            return res.status(401).json({ message: 'Invalid token' });
        };
        const user = await User.findById(decoded.id);
        if (!user || !user.token) {
            return res.status(401).json({ message: "Not authorized" });
        }
        req.user = {
            id: decoded.id,
            email: decoded.email
        };
        next();
    });
}
export default authMiddleware;
