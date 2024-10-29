const express = require('express');
const router = express.Router();
const pool = require('../lib/db')
const bcrypt = require('bcrypt');



router.put('/resetpassword', async (req, res) => {
    const { username , password } = req.body;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
    if (!username  || !password) {
        return res.status(400).json({
            message: 'กรุณากรอกข้อมูลให้ครบทุกฟิลด์!'
        });
    }

    try {
        // ตรวจสอบว่ามีผู้ใช้ที่มี email หรือ studentId ตรงกันหรือไม่
        const [users] = await pool.query(`
            SELECT * FROM users WHERE email = ? OR studentId = ?
        `, [username, username]);

        if (users.length === 0) {
            return res.status(404).json({
                message: 'ไม่พบผู้ใช้ที่ตรงกับข้อมูลที่กรอก!'
            });
        }

        // ถ้ามีผู้ใช้ ให้ทำการแฮชรหัสผ่านใหม่
        const hashedPassword = await bcrypt.hash(password, 10);

        // อัปเดตรหัสผ่านในฐานข้อมูล
        await pool.query(`
            UPDATE users SET password = ? WHERE email = ? OR studentId = ?
        `, [hashedPassword, username, username]);

        res.status(200).json({
            message: 'รีเซ็ตรหัสผ่านสำเร็จ!'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน กรุณาลองใหม่อีกครั้ง.' });
    }
});

module.exports = router;