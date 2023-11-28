
const db = require('../../db.js');
const knex= db.knex;
const randomstring = require('randomstring');
var bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const investorforgotpassword = function(request){

	var passresettotken = randomstring.generate();
	var passreseturl = process.env.portalurl+'public/reset/'+passresettotken;
	var firstname;
	return new Promise(function(resolve,reject){
		return knex('users').where({email:request.email}).select('id','firstName')
			.then(function(result){
				if(!result.length)
					throw 'Account not exist';
				firstname = result[0].firstName;
				return knex('users').where('id',result[0].id).update({passwordResetToken:passresettotken});	
			})
			.then(function(result){
				dataobject = {
					firstname: firstname,
					passreseturl: passreseturl
				};

				resolve(dataobject);
			})
			.catch(function(error){
				reject(error);
			})

	});
}



module.exports={investorforgotpassword};