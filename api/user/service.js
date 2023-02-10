const { query, transaction } = require('../utils/db.js');

function getUserList(req, res, next) {
	let pagelength = parseInt(req.query.pagelength) || 100;
	let start = ((req.query.page || 1) - 1) * 2;
	let sql;
	if (req.query.filter) {
		sql = `
			(SELECT Mobile, Referer, Name, Email, Account_IFSC, Account_Number, Account_Name, Account_UPI, PAN, AADHAR, Balance, Time, Password, Status FROM Users WHERE isAdmin < 1 AND (Mobile LIKE :filter OR Referer LIKE :filter OR Name LIKE :filter) ORDER BY Time DESC LIMIT ${start}, ${pagelength})
			UNION ALL
			SELECT COUNT(*), SUM(Balance), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL FROM Users WHERE isAdmin < 1 AND (Mobile LIKE :filter OR Referer LIKE :filter OR Name LIKE :filter);
		`;
	} else {
		sql = `
			(SELECT Mobile, Referer, Name, Email, Account_IFSC, Account_Number, Account_Name, Account_UPI, PAN, AADHAR, Balance, Time, Password, Status FROM Users WHERE isAdmin < 1 LIMIT ${start}, ${pagelength})
			UNION ALL
			SELECT COUNT(*), SUM(Balance), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, :filter FROM Users WHERE isAdmin < 1;
		`;
	}
	query(sql, { filter: `%${req.query.filter}%` })
		.then(function (rows) {
			let metaData = rows.pop();
			res.json(rows, { count: metaData["Mobile"], totalBalance: metaData["Referer"] });
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function getUser(req, res, next) {
	query("SELECT Mobile, Referer, Name, Email, Account_IFSC, Account_Number, Account_Name, Account_UPI, PAN, AADHAR, Balance, Time, Password, Status  FROM Users WHERE Mobile = ?", [req.params.mobile])
		.then(function (rows) {
			res.json(rows);
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function deleteUser(req, res, next) {
	query("DELETE FROM Users WHERE Mobile = ?", [req.params.mobile])
		.then(function (rows) {
			res.json(rows);
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function updateUser(req, res, next) {
	items = req.body;
	let qs = [];
	let updatableColumns = [ "Name", "Email", "Account_IFSC", "Account_Number", "Account_Name", "Account_UPI", "PAN", "AADHAR", "Password", "Status", "Referer"];
	Object.entries(req.body).forEach(([key, value]) => {
		if (updatableColumns.includes(key)) qs.push(`${key} = :${key}`);
		else delete items[key];
	});
	items.Mobile = req.params.mobile;
	query(`UPDATE Users SET ${qs.join(", ")} WHERE Mobile = :Mobile`, items)
		.then(function (rows) {
			res.json(rows, { status: "success", message: `Member ${req.params.mobile} succesfully updated` });
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function addUser(req, res, next) {
	query("CALL insertUser(:Mobile, :Referer, :Name, :Email, :Account_IFSC, :Account_Number, :Account_Name, :Account_UPI, :PAN, :AADHAR, :Password);", req.body)
		.then(function (rows) {
			res.json(rows, { status: "success", message: `${req.body.Name} succesfully registered with mobile ${req.body.Mobile}` }, 200);
		}).catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function updateUserStatus(req, res, next) {
	query("UPDATE Users SET status = status * -1  WHERE Mobile = ?", [req.params.mobile])
		.then(function (rows) {
			res.json(rows);
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function requestPayout(req, res, next) {
	query("INSERT INTO Payout_Requests (Mobile, Amount, Details) VALUES (:Mobile, :Amount, :Details)", req.body)
		.then(function (rows) {
			res.json(rows);
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

module.exports = {
	getUser, deleteUser, getUserList, updateUser, addUser, updateUserStatus, requestPayout
};