const express = require('express');
const router = express.Router();
const path = require('path');
const ResetPassApi = require('../API/ResetPassApi');
const { authenticateJWT, checkAuthAdmin } = require('../middleware');

// สำหรับการเช็ค admin
const CheckAdminApi = require('../API/CheckAdmin');

// เส้นทางสำหรับหน้ารีเซ็ตรหัสผ่าน
router.get('/resetpassword', authenticateJWT, checkAuthAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'assets', 'html', 'resetpass.html'));
});

// ใช้ CheckAdminApi และ ResetPassApi สำหรับเส้นทางที่เกี่ยวข้อง
router.get('/check-admin', CheckAdminApi);

router.use('/' , ResetPassApi)

module.exports = router;
