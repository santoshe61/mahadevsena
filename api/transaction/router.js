const express = require('express');
const service = require('./service.js');
const router = express.Router();

router
	.get('/', service.getTransactionList);

module.exports = router;