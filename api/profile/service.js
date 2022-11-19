const { query } = require('../utils/db.js');

function updateProfile(req, res, next) {
	items = req.body;
	let qs = [];
	let updatableColumns = [ "Name", "Email", "Account_IFSC", "Account_Number", "Account_Name", "Account_UPI", "PAN", "AADHAR", "Password", "Referer"];
	Object.entries(req.body).forEach(([key, value]) => {
		if (updatableColumns.includes(key)) qs.push(`${key} = :${key}`);
		else delete items[key];
	});
	items.Mobile = req.params.mobile;
	query(`UPDATE users SET ${qs.join(", ")} WHERE Mobile = :Mobile`, items)
		.then(function (rows) {
			res.json(rows, { status: "success", message: `Profile succesfully updated` });
		})
		.catch(function (err) {
			res.json(null, { status: "danger", message: err.message }, 404);
		})
}

module.exports = {
	updateProfile
};