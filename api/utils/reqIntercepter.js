const { query } = require('./db.js');

function reqIntercepter(checkAuth) {
	return function (req, res, next) {
		let resJson = res.json;
		res.json = function (data, meta = {}, status = 200) {
			res.status(status);
			resJson.call(res, {
				meta: {
					...meta,
				},
				body: data,
				req: req.body
			});
		}
		if (checkAuth) {
			const [Mobile, Password] = Buffer.from(req.get("Authorization"), 'base64').toString('utf-8').split(":");
			// console.log(Mobile, Password, req.get("Authorization"));
			query("SELECT Mobile, Password FROM Users WHERE Mobile = :Mobile", { Mobile }).then(([row]) => {
				if (row && (row?.Password == Password)) {
					req.authUser = row.Mobile;
					next();
				} else {
					res.json(null, { status: "danger", message: "Please login first ...", redirect: "/login" })
				}
			}).catch(err => {
				res.json(null, { status: "danger", message: "Please login first ...", redirect: "/login" })
			})
		} else next();
	}
}

module.exports = reqIntercepter;