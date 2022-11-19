const express = require('express');
const service = require('./service.js');
const router = express.Router();

router
	.route('/')
	.get(service.getUserList)
	.post(service.addUser);

router
	.route('/:mobile')
	.get(service.getUser)
	.patch(service.updateUser)
	.delete(service.deleteUser);

router
	.route('/:action/:mobile')
	.patch(function (req, res, next) {
		let action = req.params.action;
		if (action === "change-status") {
			service.updateUserStatus(req, res, next);
		} else if (action === "request-payout") {
			service.requestPayout(req, res, next);
		}
	 });

module.exports = router;