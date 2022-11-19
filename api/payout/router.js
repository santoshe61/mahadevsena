const express = require('express');
const service = require('./service.js');
const router = express.Router();

router
	.route('/')
	.get(service.getPayoutList)
	.post(service.addPayout);

router
	.route('/:id')
	.patch(service.processPayout);

module.exports = router;