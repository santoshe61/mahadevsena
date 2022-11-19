function reqIntercepter(checkAuth) {
	return function (req, res, next) {

		// res.header('Access-Control-Allow-Origin', '*');
		// res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		// res.header("Access-Control-Allow-Headers", "Origin, Authorization, Content-Type, Accept");


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
			const token = req.get("Authorization");
			next();
		}else next();
	}
}

module.exports = reqIntercepter;