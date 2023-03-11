const { query } = require('../utils/db.js');

function getTransactionList(req, res, next) {
	req.onlyAdmin();
	let pagelength = parseInt(req.query.pagelength) || 100;
	let start = ((req.query.page || 1) - 1) * pagelength;
	let sql;
	if (req.query.filter) {
		sql = `
			(SELECT t.Mobile, u.Name Name, t.Amount, t.Joinee, j.Name Joinee_Name, t.Time FROM Transactions t LEFT JOIN Users u ON u.Mobile = t.Mobile LEFT JOIN Users j ON j.Mobile = t.Joinee WHERE t.Mobile LIKE :filter OR t.Joinee LIKE :filter ORDER BY t.Time DESC LIMIT ${start}, ${pagelength})
			UNION ALL
			SELECT COUNT(*), SUM(Amount), NULL, NULL, NULL, NULL FROM Transactions WHERE Mobile LIKE :filter OR Joinee LIKE :filter;
		`;
	} else {
		sql = `
			(SELECT t.Mobile, u.Name Name, t.Amount, t.Joinee, j.Name Joinee_Name, t.Time FROM Transactions t LEFT JOIN Users u ON u.Mobile = t.Mobile LEFT JOIN Users j ON j.Mobile = t.Joinee ORDER BY t.Time DESC LIMIT ${start}, ${pagelength})
			UNION ALL
			SELECT COUNT(*), SUM(Amount), NULL, NULL, NULL, :filter FROM Transactions;
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