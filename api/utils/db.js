// get the client
const mysql = require('mysql2');
// const mysql = require('mysql2/promise');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'bhartiyavirasat'
});

connection.config.namedPlaceholders = true;

function query(sql, params, callback) {
	return connection
		.promise()
		.execute(sql, params, callback)
		.then(([rows]) => rows)
		.catch(({ message, errno, sqlState }) => {
			throw { message, errno, sqlState, status: "error" };
		});
}
function txn(callback) {
	return connection
		.promise()
		.beginTransaction()
		.then(() => {
			callback(connection)
				.then(() => {
					connection.commit().then(function ({ message, errno, sqlState }) {
						throw { message, errno, sqlState, status: "error" };
					});
				})
				.catch(({ message, errno, sqlState }) => {
					connection.rollback().then(function () {
						throw { message, errno, sqlState, status: "error" };
					});
				});
		})
		.catch(({ message, errno, sqlState }) => {
			connection.rollback(function () {
				throw { message, errno, sqlState, status: "error" };
			});
		});




}

function transaction(callback) {
	return new Promise((resolve, reject) => {
		connection.beginTransaction(function (err) {
			if (err) { reject(err); }
			callback(connection).then(() => {
				connection.commit(function (err) {
					if (err) {
						connection.rollback(function () {
							reject(err);
						});
					}
					resolve();
				});
			}).catch((err) => {
				connection.rollback(function () {
					reject(err);
				});
			});
		});
	});



}
module.exports.transaction = transaction;
module.exports.connection = connection;
module.exports.query = query;
