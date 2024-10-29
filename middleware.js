const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login'); 
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/login'); 
        }
        req.user = user; 
        next();
    });
}

function checkAuthAdmin(req, res, next) {
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'ไม่มีสิทธิ์ การเข้าถึง' });
    }
    next(); 
}

module.exports = { authenticateJWT, checkAuthAdmin };
