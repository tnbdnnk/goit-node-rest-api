import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    const authorizarionHeader = req.headers.authorization;
    if (typeof authorizarionHeader === 'undefined') {
        return res.status(401).json({ message: 'Authorization header is missing' });
    };
    const [bearer, token] = authorizarionHeader.split(" ", 2);
    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Invalid authorization header format' });
    };
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: 'Token expired error.' });
            };
            return res.status(401).json({ message: 'Invalid token' });
        };
        req.user = {
            id: decode.id,
            email: decode.email
        };
        next();
    });
}
export default authMiddleware;
