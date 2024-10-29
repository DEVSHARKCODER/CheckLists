const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../lib/db')

router.post('/register', async (req, res) => {
    const { fullname, email, studentId, password } = req.body;

    // Validate input
    if (!fullname || !email || !studentId || !password) {
        return res.status(400).json({
            message: 'กรุณากรอกข้อมูลให้ครบทุกฟิลด์!'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check for duplicates
        const [existingUsers] = await pool.query(`
            SELECT * FROM users WHERE fullname = ? OR email = ? OR studentId = ?`,
            [fullname, email, studentId]
        );

        if (existingUsers.length > 0) {
            const errors = [];

            // Check specific duplicates
            if (existingUsers.some(user => user.fullname === fullname)) {
                errors.push('ชื่อผู้ใช้มีอยู่ในระบบแล้ว');
            }
            if (existingUsers.some(user => user.email === email)) {
                errors.push('อีเมลมีอยู่ในระบบแล้ว');
            }
            if (existingUsers.some(user => user.studentId === studentId)) {
                errors.push('รหัสนักศึกษาอยู่ในระบบแล้ว');
            }

            return res.status(400).json({
                message: errors.join(', ')
            });
        }

        // Insert new user if no duplicates found
        const [result] = await pool.query(`
            INSERT INTO users (fullname, email, studentId, password) VALUES (?, ?, ?, ?)`,
            [fullname, email, studentId, hashedPassword]
        );

        res.status(201).json({
            message: 'ลงทะเบียนสำเร็จ'
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง.' });
    }
});





module.exports= router;