
var jwt = require('jsonwebtoken');
require('dotenv').config()
// const { INVESTOR_ACCESS_TOKEN_SECRET, ADMIN_ACCESS_TOKEN_SECRET, DAO_ACCESS_TOKEN_SECRET } = require('./keys');





let checkToken = (req, res, next) => {

	let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];




	if (token) {
		let tokenSecret;
		let tokenDecoded = jwt.decode(token);
		let roleID = tokenDecoded.roleID;

		if (roleID == 1)
			tokenSecret = process.env.INVESTOR_ACCESS_TOKEN_SECRET;

		if (roleID == 2)
			tokenSecret = process.env.ADMIN_ACCESS_TOKEN_SECRET;


		jwt.verify(token, tokenSecret, (err, decoded) => {

			if (err) {

				return res.sendStatus(401);
			} else {
				req.decoded = decoded;
				next();
			}

		});
	} else {
		return res.sendStatus(401);
	}


};


let checkAdminToken = (req, res, next) => {
	let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
	if (token) {

		let tokenDecoded = jwt.decode(token);



		jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, decoded) => {

			if (err) {

				return res.sendStatus(401);
			} else {
				req.decoded = decoded;
				next();
			}

		});
	} else {
		return res.sendStatus(401);
	}
}


let checkUserToken = (req, res, next) => {
	let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
	if (token) {

		let tokenDecoded = jwt.decode(token);



		jwt.verify(token, process.env.INVESTOR_ACCESS_TOKEN_SECRET, (err, decoded) => {

			if (err) {

				return res.sendStatus(401);
			} else {
				req.decoded = decoded;
				next();
			}

		});
	} else {
		return res.sendStatus(401);
	}
}


function checkUserPermissions(requiredPermissions) {
	return function (req, res, next) {

		let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
		if (token) {

			let tokenDecoded = jwt.decode(token);



			jwt.verify(token, process.env.DAO_ACCESS_TOKEN_SECRET, (err, decoded) => {

				if (err) {

					return res.sendStatus(401);
				} else {
					req.decoded = decoded;
					let userPermissions = req.decoded.permissions;

					if (!(userPermissions&&userPermissions.includes(requiredPermissions))) {
						return res.status(403).json({ error: true, message: 'Insufficient access', data: '' });
					};
				
					next();

				}

			});
		} else {
			return res.status(401).json({ error: true, message: 'Auhtorization failed', data: '' });
		}

	}

}
module.exports = {
	checkToken: checkToken,
	checkAdminToken: checkAdminToken,
	checkUserToken: checkUserToken,
	checkUserPermissions: checkUserPermissions
}
