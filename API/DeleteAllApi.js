const express = require('express');
const router = express.Router();
const pool = require('../lib/db'); 

router.delete('/deleteAll', async (req, res) => {
  const { fullname } = req.body; 
  const decryptedFullname = decodeURIComponent(fullname);
    console.log(decryptedFullname)
  if (!decryptedFullname) {
    return res.status(400).json({ message: 'ไม่พบ fullname ในคำขอ' });
  }

  try {
    // ลบข้อมูลจาก checklists ที่ username ตรงกับ fullname
    const result = await pool.query('DELETE FROM checklists WHERE username = ?', [decryptedFullname]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลสำหรับผู้ใช้ที่ระบุ' });
    }

    return res.status(200).json({ message: `ข้อมูลทั้งหมดถูกลบโดย ${fullname}` });
  } catch (error) {
    console.error('Error deleting data:', error);
    return res.status(500).json({ message: 'ไม่สามารถลบข้อมูลได้' });
  }
});

module.exports = router;
