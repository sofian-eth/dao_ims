
const db = require('../../db.js');
const knex = db.knex;




const fetchUserID = function(request){
	return knex('users').where({'email': request}).orWhere({'phoneNumber':request}).orWhere({'membershipNumber':request}).select('id');
}
const fetchCLientID = function(id){
	return knex('users').where({'id': id}).select('clientID');
}


module.exports={fetchUserID,fetchCLientID};