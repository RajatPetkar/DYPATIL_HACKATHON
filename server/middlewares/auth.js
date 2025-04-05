const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    let token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({
        status: 'error',
        error: 'Authentication failed! Please login please',
        });
    }
    try {
        token = token.includes("Bearer ") ? token.split(" ")[1] : token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        console.log("Decoded JWT:", decoded.id);
        
        next();
    } catch (error) {
        return res.status(401).json({
        status: 'error',
        error: 'Authentication failed! Please login',
        });
    }
};

module.exports = authenticateUser;