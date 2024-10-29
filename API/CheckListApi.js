const express = require('express');
const router = express.Router();
const pool = require('../lib/db'); // เชื่อมต่อกับฐานข้อมูล
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/checklists', async (req, res) => {
    const statusFilter = req.query.status;
    const fullname = req.cookies.fullname; // แปลงข้อมูลจาก cookies

    let query = 'SELECT * FROM checklists WHERE username = ?';

    if (statusFilter && statusFilter !== 'ทั้งหมด') {
        query += ' AND status = ?';
    }

    try {
        const params = [fullname];
        if (statusFilter && statusFilter !== 'ทั้งหมด') {
            params.push(statusFilter);
        }

        const [results] = await pool.query(query, params);
        
        // ตรวจสอบว่ามีผลลัพธ์หรือไม่
        if (results.length === 0) {
            return res.json({ message: "ไม่มีข้อมูล" });

        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8'); 
        res.json(results);
    } catch (error) {
        console.error('Error fetching data: ', error);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});



// เพิ่ม Check List ใหม่
router.post('/checklists', async (req, res) => {
    const { nameitem, description, tags, notes, duedate, userId } = req.body; 

    if (!nameitem || !description || !duedate) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO checklists (nameitem, description, tags, notes, duedate, userId) VALUES (?, ?, ?, ?, ?, ?)',
            [nameitem, description, tags, notes, duedate, userId]
        );

        res.status(201).json({ message: 'เพิ่มรายการสำเร็จ', id: result.insertId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มรายการ' });
    }
});




// แก้ไข สถานะ
router.put('/checklists/:id', async (req, res) => {
    const { status } = req.body; 
    const { id } = req.params;

    try {
        const query = 'UPDATE checklists SET status = ? WHERE id = ?';
        await pool.query(query, [status, id]); // อัปเดตสถานะในฐานข้อมูล

        res.status(200).send({ message: 'Status updated successfully!' });
    } catch (error) {
        console.error('Error updating checklist:', error);
        res.status(500).send({ message: 'Error updating checklist' });
    }
});

router.put('/checklists/:id/overdue', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      await pool.query('UPDATE checklists SET status = ? WHERE id = ?', [status, id]);
      res.status(200).json({ message: 'สถานะอัพเดทเป็น "เลยกำหนด" สำเร็จแล้ว' });
    } catch (error) {
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ' });
    }
  });

// ลบ Check List
router.delete('/checklists/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM checklists WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบรายการที่ต้องการลบ' });
        }

        res.status(200).json({ message: 'ลบรายการสำเร็จ' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบรายการ' });
    }
});

module.exports = router;
