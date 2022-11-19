const {query} = require('../utils/db.js');

function login(req, res, next) {
	// res.json(req.body.Pass);
	// return;
	console.log(req)
	query("SELECT * FROM users WHERE Mobile = ?", [req.body.Mobile])
		.then(async function (rows) {
			await await new Promise((res) => setTimeout(res, 3000));
			let user = rows[0];
			if (user && user.Password === req.body.Pass) {
				delete user.Password;
				res.json(user, { status: "success", message: "Succesfully logged in, redirecting ...", redirect: "/" });
			} else {
				res.json(null, {status: "danger", message: "Invalid login credentials"}, 400);
			}
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function getReferer(req, res, next) {
	query("SELECT Name, Mobile FROM users WHERE Mobile = ?", [req.body.Referer])
		.then(function (rows) {
			res.json(rows);
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

function register(req, res, next) {
	query("INSERT INTO users (Mobile, Referer, Name, Email, Password) VALUES (?, ?, ?, ?, ?)", [req.body.Mobile, req.body.Referer, req.body.Name, req.body.Email, req.body.Password])
		.then(function (rows) {
			res.json(rows);
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}


module.exports = {
	login, getReferer, register
};