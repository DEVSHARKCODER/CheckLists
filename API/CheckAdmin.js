const express = require('express');
const router = express.Router();

const { authenticateJWT, checkAuthAdmin } = require('../middleware');

router.get('/check-admin', authenticateJWT, checkAuthAdmin, (req, res) => {
   
    res.status(200).json({ message: 'คุณมีสิทธิ์เข้าถึงข้อมูลนี้' });
});

module.exports = router;
