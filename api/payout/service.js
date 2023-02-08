const { query } = require('../utils/db.js');

function getPayoutList(req, res, next) {
	let pagelength = parseInt(req.query.pagelength) || 100;
	let start = ((req.query.page || 1) - 1) * 2;
	let sql = "";
	let filter = "";
	// console.log(req.query);
	if (req.query.filter) {
		filter = " AND (Payouts.Mobile LIKE :filter OR Payouts.Paid_Time LIKE :filter) "
	}

	if (req.query.Status == "-2") { // Paids
		sql = `
		(SELECT
			 Payouts.Payout_ID Payout_ID, Payouts.Mobile Mobile, Users.Name Name, Payouts.Request_Amount Request_Amount, Payouts.Paid_Amount Paid_Amount, Payouts.Request_Time Request_Time, Payouts.Paid_Time Paid_Time, Users.Referer Referer, Payouts.Request_Details Request_Details, Payouts.Paid_Details Paid_Details FROM Payouts LEFT JOIN Users ON Users.Mobile = Payouts.Mobile WHERE Payouts.Status = -2 ${filter} ORDER BY Payouts.Paid_Time DESC LIMIT ${start}, ${pagelength})
			UNION ALL
			SELECT :filter, COUNT(*), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL FROM Payouts WHERE Status = -2 ${filter};
		`;
	} else { // Unpaids
		sql = `
			(SELECT Payouts.Payout_ID Payout_ID, Payouts.Mobile Mobile, Users.Name Name, Payouts.Request_Amount Request_Amount, Payouts.Request_Details Request_Details, Payouts.Request_Time Request_Time, Payouts.Status Status, Users.Referer Referer, Users.Account_IFSC Account_IFSC, Users.Account_Number Account_Number, Users.Account_Name Account_Name, Users.Account_UPI Account_UPI FROM Payouts LEFT JOIN Users ON Users.Mobile = Payouts.Mobile WHERE Payouts.Status > -2 ${filter} ORDER BY Payouts.Payout_ID DESC LIMIT ${start}, ${pagelength})
			UNION ALL
			SELECT :filter, COUNT(*), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL FROM Payouts WHERE Status > -2 ${filter};
		`;
	}
	// console.log(sql);
	query(sql, { filter: `%${req.query.filter}%` })
		.then(function (rows) {
			let metaData = rows.pop();
			res.json(rows, { count: metaData["Mobile"] });
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function processPayout(req, res, next) {
	query("UPDATE Payouts SET Paid_Amount = :Paid_Amount, Paid_Details = :Paid_Details, Status = -2 WHERE Payout_ID = :Payout_ID", {
		Paid_Amount: req.body.Paid_Amount,
		Paid_Details: req.body.Paid_Details,
		Payout_ID: req.params.id
	})
		.then(function (rows) {
			res.json(rows, { status: "success", message: `Payout ID #${req.params.id} for ${req.body.Mobile} paid succesfully` }, 200);
		}).catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		});
}

function addPayout(req, res, next) {
	query("INSERT INTO Payouts (Mobile, Request_Amount, Request_Details) VALUES (:Mobile, :Request_Amount, :Request_Details)", req.body)
		.then(function (rows) {
			res.json(rows, { status: "success", message: `Payout for ${req.body.Mobile} added succesfully`, redirect: "/" }, 200);
		}).catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		});
}

module.exports = {
	getPayoutList, processPayout, addPayout
};