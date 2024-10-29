const express = require('express');
const router = express.Router();
const path = require('path');

const indexApi = require('../API/IndexAPI')
const { authenticateJWT, checkAuthAdmin } = require('../middleware');



// Page Index
router.get('/',authenticateJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'assets', 'html', 'index.html'));
});



router.post('/addchecklists', indexApi);

// ส่งออก router
module.exports = router;