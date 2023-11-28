
const db = require('../../db.js');
const knex = db.knex;



const profilestatus = function(id){
	return knex('users').where({id:id}).select('is_email_verified')
	.then(function(result){
		return result;
	})
	.catch(function(error){
		throw error;
	})
}

module.exports={profilestatus};