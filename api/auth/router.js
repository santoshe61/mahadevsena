const express = require('express');
const service = require('./service.js');
const router = express.Router();

router.post('/login', service.login);
router.post('/register', service.register);
router.get('/:referer', service.getReferer);

module.exports = router;