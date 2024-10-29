const express = require('express');
const router = express.Router();
const path = require('path');
const CheckListApi = require('../API/CheckListApi')
const { authenticateJWT, checkAuthAdmin } = require('../middleware');
const DeleteAllApi = require('../API/DeleteAllApi')

// Page CheckLists
router.get('/checklist',authenticateJWT,(req, res) => {
    res.sendFile(path.join(__dirname, '..', 'assets', 'html', 'checklist.html'));
});

router.use('/',  CheckListApi , DeleteAllApi);

// ส่งออก router
module.exports = router;