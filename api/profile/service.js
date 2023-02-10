const { query } = require('../utils/db.js');

function getDashboard(req, res, next) {
	return query(`SELECT COUNT(*) Count, (SELECT COUNT(*) count FROM Transactions WHERE Mobile = :Mobile) Team, (SELECT Balance FROM Users WHERE Mobile = :Mobile) Balance FROM Users WHERE Referer = :Mobile`, { Mobile: req.authUser })
		.then(function (rows) {
			res.json(rows);
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function updateProfile(req, res, next) {
	items = req.body;
	let qs = [];
	let updatableColumns = [ "Name", "Email", "Account_IFSC", "Account_Number", "Account_Name", "Account_UPI", "PAN", "AADHAR", "Password", "Referer"];
	Object.entries(req.body).forEach(([key, value]) => {
		if (updatableColumns.includes(key)) qs.push(`${key} = :${key}`);
		else delete items[key];
	});
	items.Mobile = req.authUser;
	query(`UPDATE Users SET ${qs.join(", ")} WHERE Mobile = :Mobile`, items)
		.then(function (rows) {
			res.json(true, { status: "success", message: `Profile succesfully updated` });
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function updatePassword(req, res, next) {
	query(`SELECT Password FROM Users WHERE Mobile = :Mobile`, { Mobile: req.authUser })
		.then(function (rows) {
			if (rows[0].Password === req.body.OPassword) {
				query(`UPDATE Users SET Password = :Password WHERE Mobile = :Mobile`, { Password: req.body.Password, Mobile: req.authUser })
					.then(function (rows) {
						res.json(true, { status: "success", message: `Password succesfully updated` });
					})
					.catch(function (err) {
						res.json(null, { status: "danger", message: err.message }, 404);
					})
			} else {
				res.json(null, { status: "danger", message: "Invalid current password provided" }, 400);
			}
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function requestPayout(req, res, next) {
	query("SELECT Payouts.Status LastPayoutStatus, Users.Balance Balance FROM Payouts RIGHT OUTER JOIN Users ON Users.Mobile = Payouts.Mobile WHERE Users.Mobile = ? ORDER BY Payouts.Status DESC", [req.authUser]).then(function (wallet) {
		if (wallet[0].LastPayoutStatus > 0) {
			res.json(null, { status: "danger", message: "Previous payout request is still pending, please wait" }, 400);
			return false;
		} else if (wallet[0].Balance < req.body.Request_Amount) {
			res.json(null, { status: "danger", message: "Request amount can not be more than your balance points" }, 400);
			return false;
		}
		query("INSERT INTO Payouts (Mobile, Request_Amount, Request_Details) VALUES (:Mobile, :Request_Amount, :Request_Details)", { Mobile: req.authUser, Request_Amount: req.body.Request_Amount, Request_Details: req.body.Request_Details })
			.then(function (rows) {
				res.json(rows, { status: "success", message: `Payout request created succesfully, we will get back to you soon` }, 200);
			}).catch(function (err) {
				res.json(null, { status: "danger", message: err.message }, 404);
			});
	}).catch(function (err) {
		res.json(null, { status: "danger", message: err.message }, 404);
	});
}

module.exports = {
	updateProfile, updatePassword, getDashboard, requestPayout
};