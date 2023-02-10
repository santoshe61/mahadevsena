DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
	Mobile BIGINT(10) UNSIGNED NOT NULL,
	Referer BIGINT(10) UNSIGNED NULL,
	Name VARCHAR(100) NOT NULL,
	Email VARCHAR(100) NULL,
	Account_IFSC VARCHAR(11) NULL,
	Account_Number VARCHAR(20) NULL,
	Account_Name VARCHAR(100) NULL,
	Account_UPI VARCHAR(100) NULL,
	PAN VARCHAR(10) NULL,
	AADHAR VARCHAR(14) NULL,
	Password CHAR(128) NOT NULL,
	Balance INT(5) NOT NULL DEFAULT 0,
	Time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Status TINYINT NOT NULL DEFAULT 2,
	isAdmin TINYINT NOT NULL DEFAULT 0,
	PRIMARY KEY (Mobile),
	INDEX (Referer),
	INDEX (Status),
	INDEX (Name),
	INDEX (Time)
);
INSERT INTO `users` (`Mobile`, `Referer`, `Name`, `Email`, `Account_IFSC`, `Account_Number`, `Account_Name`, `Account_UPI`, `PAN`, `AADHAR`, `Password`, `Status`, isAdmin) VALUES
	(9999999999, 9000000000, '', '', "", "", "", "", "", "", '', -2, 1),
	(8888888888, 9999999999, '', '', "", "", "", "", "", "", '', -2, 1),
	(7777777777, 8888888888, '', '', "", "", "", "", "", "", '', -2, 1),
	(6666666666, 7777777777, '', '', "", "", "", "", "", "", '', -2, 1),
	(9718181389, 6666666666, 'Santosh', 'santoshe61@gmail.com', "", "", "Santosh", "", "", "", 'Sonuu1', 2, 1),
	(9821738618, 9718181389, 'Pankaj', 'pankaj@gmail.com', "", "", "Pankaj", "", "", "", 'Pankaj1', 2, 1);



DROP TABLE IF EXISTS Transactions;
CREATE TABLE Transactions (
	Mobile BIGINT(10) UNSIGNED NOT NULL,
	Amount INT(10) NOT NULL,
	Joinee BIGINT(10) UNSIGNED NOT NULL,
	Time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Status TINYINT NOT NULL DEFAULT 2,
	PRIMARY KEY (Mobile, Joinee),
	INDEX (Joinee),
	INDEX (Status),
	INDEX (Time)
);

DROP TABLE IF EXISTS Payouts;
CREATE TABLE Payouts (
	Payout_ID MEDIUMINT(6) UNSIGNED NOT NULL AUTO_INCREMENT,
	Mobile BIGINT(10) UNSIGNED NOT NULL,
	Request_Amount INT(10) UNSIGNED NOT NULL,
	Request_Details VARCHAR(500) NOT NULL,
	Request_Time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Paid_Amount INT(10) UNSIGNED NULL,
	Paid_Details VARCHAR(500) NULL,
	Paid_Time TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
	Status TINYINT NOT NULL DEFAULT 2, -- => 2=unpaid, 1=approved for payment, -2=paid,
	PRIMARY KEY (Payout_ID),
	INDEX (Mobile),
	INDEX (Status),
	INDEX (Paid_Time)
);


DROP TRIGGER IF EXISTS update_users_balance_after_add_payouts;
DELIMITER //
CREATE TRIGGER update_users_balance_after_add_payouts AFTER UPDATE ON Payouts FOR EACH ROW
BEGIN
	IF (OLD.Status = 2 AND NEW.Status = -2) THEN
		UPDATE Users SET Balance = Balance - NEW.Paid_Amount WHERE Mobile = NEW.Mobile;
	END IF;
END; //


DROP PROCEDURE IF EXISTS insertUser;
DELIMITER //
CREATE PROCEDURE insertUser (IN _Mobile BIGINT(10), IN _Referer BIGINT(10), IN _Name VARCHAR(100), IN _Email VARCHAR(100), IN _Account_IFSC VARCHAR(11), IN _Account_Number VARCHAR(20), IN _Account_Name VARCHAR(100), IN _Account_UPI VARCHAR(100), IN _PAN VARCHAR(10), IN _AADHAR VARCHAR(14), IN _Password CHAR(128))
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
		RESIGNAL;
    END;
    START TRANSACTION;
		INSERT INTO Users (Mobile, Referer, Name, Email, Account_IFSC, Account_Number, Account_Name, Account_UPI, PAN, AADHAR, Password)
			VALUES (_Mobile, _Referer, _Name, _Email, _Account_IFSC, _Account_Number, _Account_Name, _Account_UPI, _PAN, _AADHAR, _Password);

		SELECT
			L1.Mobile , L2.Mobile, L3.Mobile, L4.Mobile, L4.Referer INTO @Level1, @Level2, @Level3, @Level4, @Level5
		FROM
			users L1
			LEFT JOIN users L2 ON L2.Mobile = L1.Referer
			LEFT JOIN users L3 ON L3.Mobile = L2.Referer
			LEFT JOIN users L4 ON L4.Mobile = L3.Referer
			WHERE L1.Mobile = _Referer;

		INSERT INTO Transactions (Mobile, Amount, Joinee) VALUES
			(@Level1, 30, _Mobile),
			(@Level2, 25, _Mobile),
			(@Level3, 20, _Mobile),
			(@Level4, 15, _Mobile),
			(@Level5, 10, _Mobile);

		UPDATE Users SET Balance = Balance + 30 WHERE Mobile = @Level1;
		UPDATE Users SET Balance = Balance + 25 WHERE Mobile = @Level2;
		UPDATE Users SET Balance = Balance + 20 WHERE Mobile = @Level3;
		UPDATE Users SET Balance = Balance + 15 WHERE Mobile = @Level4;
		UPDATE Users SET Balance = Balance + 10 WHERE Mobile = @Level5;
	COMMIT;
END; //
