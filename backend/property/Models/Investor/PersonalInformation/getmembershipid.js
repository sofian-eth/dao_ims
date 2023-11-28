
const db = require('../../db.js');
const knex = db.knex;




const getinvestordetails = function(investorid){
	return knex('users')
	.where({'users.id':investorid})
	.select('users.membershipNumber','users.firstName','users.lastName','users.email','users.createdAt','users.legalName')
	.then(function(result){
		return result;
	})
	.catch(function(error){
		throw error;
	})
}


async function userDetail (userID){
	return knex('users')
	.where({'users.id':userID})
	.select('users.membershipNumber','users.phoneNumber','users.firstName','users.lastName','users.email','users.createdAt','users.legalName')
	.then(function(result){
		let response = result;
        if(result.length)
            response = result[0];
        return response;
	})
	.catch(function(error){
		throw error;
	})
}

module.exports={getinvestordetails,userDetail};