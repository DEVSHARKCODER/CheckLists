
const express = require('express');
const router = express.Router();
const path = require('path');
const LoginApi = require('../API/LoginAPI')
const LogoutApi = require('../API/LogoutApi')

// Route สำหรับหน้า Login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'assets', 'html', 'login.html'));
});

router.post('/login' , LoginApi )

router.use('/', LogoutApi);
// Export router
module.exports = router;
