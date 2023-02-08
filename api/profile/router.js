const express = require('express');
const service = require('./service.js');
const router = express.Router();

router
	.get('/', service.getDashboard)
	.patch('/', service.updateProfile)
	.patch('/changepass', service.updatePassword)
	.patch('/payout-request', service.requestPayout);;

module.exports = router;