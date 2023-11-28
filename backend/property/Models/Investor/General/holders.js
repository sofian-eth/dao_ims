const db = require('../../db.js');
const knex = db.knex;



const getholdertables = function(){
	var circulation;
	return knex('property').where({id:1}).select('circulationArea')
		.then(function(result){
			circulation = result[0].circulationarea;
			return knex('portfoliobalance').join('users','portfoliobalance.userID','users.id').orderBy('portfoliobalance.balance','DESC').select('users.walletAddress','portfoliobalance.balance');
		})
		.then(function(result){
			var jsonobject = {
				circulationarea : circulation,
				holdertable : result
			};

			return jsonobject;
		})
		.catch(function(error){
			throw error;
		})
}

const getholderDetail = function(){
	return knex('portfoliobalance as b')
	.join('users as u','b.userID','u.id')
	.join('property as p','b.propertyID','p.id')
	.orderBy('b.balance','DESC')
	.select('u.legalName','p.name as propertyName','b.balance as portfolioBalance','b.netInvestment')
	.then(function(result){
	return result;
	})
	.catch(function(error){
		throw error;
	})
}

module.exports={getholdertables,getholderDetail};