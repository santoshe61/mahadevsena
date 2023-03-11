const {query} = require('../utils/db.js');

function login(req, res, next) {
	// res.json(req.body.Pass);
	// return;
	// console.log(req)
	query("SELECT * FROM Users WHERE Mobile = ?", [req.body.Mobile])
		.then(async function (rows) {
			// await await new Promise((res) => setTimeout(res, 3000));
			let user = rows[0];
			if (user && user.Password === req.body.Pass) {
				user.Token = Buffer.from(`${user.Mobile}:${user.Password}`, 'utf-8').toString('base64');
				delete user.Password;
				res.json(user, { status: "success", message: "Succesfully logged in, redirecting ...", redirect: "/app/dashboard" });
			} else {
				res.json(null, {status: "danger", message: "Invalid login credentials"}, 400);
			}
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function getReferer(req, res, next) {
	query("SELECT Name, Mobile FROM Users WHERE Mobile = ?", [req.params.referer])
		.then(function (rows) {
			res.json(rows);
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

// function add(req, res, next) {
// 	query("INSERT INTO Users (Mobile, Referer, Name, Email, Password) VALUES (?, ?, ?, ?, ?)", [req.body.Mobile, req.body.Referer, req.body.Name, req.body.Email, req.body.Password])
// 		.then(function (rows) {
// 			res.json(rows, { status: "success", message: "You have been registered succesfully, please login if required", redirect: "/login" });
// 		})
// 		.catch(function (err) {
// 			res.json(null, { status: "danger", message: err.message }, 404);
// 		})
// }

function register(req, res, next) {
	query("CALL insertUser(:Mobile, :Referer, :Name, :Email, :Account_IFSC, :Account_Number, :Account_Name, :Account_UPI, :PAN, :AADHAR, :Password);", { ...req.body, Account_IFSC: "", Account_Number: "", Account_Name: "", Account_UPI: "", PAN: "", AADHAR: "" })
		.then(function (rows) {
			res.json(rows, { status: "success", message: `${req.body.Name} succesfully registered with mobile ${req.body.Mobile}`, redirect: "/login" }, 200);
		}).catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}


module.exports = {
	login, getReferer, register
};