const express = require('express');
const router = express.Router();
const pool = require('../lib/db');




// AddLists
router.post('/addchecklists', async (req, res) => {
    const { username, nameitem, description, tags, notes, duedate } = req.body;

    
    if (!username || !nameitem || !description || !duedate) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    try {
        
        const [result] = await pool.query(
            'INSERT INTO checklists (username, nameitem, description, tags, notes, duedate) VALUES (?, ?, ?, ?, ?, ?)',
            [username, nameitem, description, tags, notes, duedate]
        );

        
        res.status(201).json({ message: 'เพิ่มรายการสำเร็จ!', id: result.insertId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มรายการ' });
    }
});

module.exports = router;
