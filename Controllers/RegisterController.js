
const express = require('express');
const router = express.Router();
const path = require('path');
const RegisterApi = require('../API/RegisterAPI')

// Route สำหรับหน้า Register
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'assets', 'html', 'register.html'));
});

router.post('/register', RegisterApi)

module.exports = router;
