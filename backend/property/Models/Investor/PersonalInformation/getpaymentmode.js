
const db = require('../../db.js');
const knex = db.knex;



const paymentmode = function (id) {
	return knex('users as u')
		.join('paymentmodeenum', 'u.paymentModeID', '=', 'paymentmodeenum.id').where({ 'u.id': id }).select('paymentmodeenum.paymentMode')
		.then(function (result) {

			if (!result[0])
				throw 'Payment mode not setup'
			return result;
		})
		.catch(function (error) {
			throw error;
		})
}

module.exports = { paymentmode };