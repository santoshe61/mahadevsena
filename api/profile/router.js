const express = require('express');
const service = require('./service.js');
const router = express.Router();

router
	.route('/:mobile')
	// .get(service.getUserList)
	.patch(service.updateProfile);

module.exports = router;