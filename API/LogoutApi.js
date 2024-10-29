const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    // ลบ cookie ที่เก็บ JWT
    res.clearCookie('token'); // ลบ cookie token

    // ถ้าคุณเก็บข้อมูลผู้ใช้อื่นๆ ใน cookies ก็สามารถลบได้เช่นกัน
    res.clearCookie('fullname'); // ลบ cookie fullname
    res.clearCookie('userId'); // ลบ cookie userId

    res.status(200).json({ message: 'ออกจากระบบสำเร็จ!' });
});

module.exports = router;
