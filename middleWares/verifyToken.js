import Jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (authHeader) {
        const token = authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1];

        try {
            const decoded = Jwt.verify(token, process.env.jwt_secret_key);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } else {
        return res.status(403).json({ message: 'No token provided' });
    }
};

const Authorize = (req, res, next) => {
        if (req.user.customerId.toString() === req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }
    };


export { Authorize, verifyToken };
