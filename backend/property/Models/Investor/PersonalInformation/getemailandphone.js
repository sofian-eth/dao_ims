
const db = require('../../db.js');
const knex = db.knex;

const getemailofinvestor = function(request){
   
	return knex('users').where({'id':request.id}).select('email','phoneNumber','legalName');
}

module.exports={getemailofinvestor};