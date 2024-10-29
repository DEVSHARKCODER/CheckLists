const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../lib/db');

router.post('/login', async (req, res) => {
    let { username, password } = req.body;

    username = username?.trim();
    password = password?.trim();

    if (!username || !password) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูล' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR studentId = ?',
            [username, username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Username ไม่ถูกต้อง' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        // สร้าง JWT
        const token = jwt.sign(
            { id: user.id, fullname: user.fullname, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // เก็บ token ใน cookie
        res.cookie('token', token, {
            httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
            secure: process.env.NODE_ENV === 'production', // ใช้เมื่ออยู่ใน production
            maxAge: 3600000 // ระยะเวลาในการเก็บ cookie (1 ชั่วโมง)
        });

        res.status(200).json({ 
            message: 'เข้าสู่ระบบสำเร็จ!',
            user: { 
                id: user.id, 
                fullname: user.fullname,
                role: user.role // ส่ง role กลับไปด้วย
            }
        });
         
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
    }
});

module.exports = router;
