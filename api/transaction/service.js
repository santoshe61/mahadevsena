const { query } = require('../utils/db.js');

function getTransactionList(req, res, next) {
	let pagelength = parseInt(req.query.pagelength) || 100;
	let start = ((req.query.page || 1) - 1) * 2;
	let sql;
	if (req.query.filter) {
		sql = `
			(SELECT Mobile, Amount, Joinee, Time FROM Transactions WHERE Mobile LIKE :filter OR Joinee LIKE :filter ORDER BY Time DESC LIMIT ${start}, ${pagelength})
			UNION ALL
			SELECT COUNT(*), SUM(Amount), NULL, NULL FROM Transactions WHERE Mobile LIKE :filter OR Joinee LIKE :filter;
		`;
	} else {
		sql = `
			(SELECT Mobile, Amount, Joinee, Time FROM Transactions ORDER BY Time DESC LIMIT ${start}, ${pagelength})
			UNION ALL
			SELECT COUNT(*), SUM(Amount), NULL, :filter FROM Transactions;
		`;
	}
	query(sql, { filter: `%${req.query.filter}%` })
		.then(function (rows) {
			let metaData = rows.pop();
			res.json(rows, { count: metaData["Mobile"], totalAmount: metaData["Amount"] });
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

module.exports = {
	getTransactionList
};