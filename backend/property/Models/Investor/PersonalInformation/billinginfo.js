
const db = require('../../db.js');
const knex = db.knex;



const billinginfo = function(id){
	return knex('users').where({userID:id}).select('billingAddress','city','province','country')
	.then(function(result){
		return result;
	})
	.catch(function(error){
		throw error;
	})
}

module.exports={billinginfo};