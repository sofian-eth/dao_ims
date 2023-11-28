
const db = require('../../db.js');
const knex = db.knex;




const investorpublickey = function(request){
	return knex('users').where({'id': request.decoded.id}).select('walletAddress as ethereumpublicaddress');
}


async function userWalletAddress(request){
	return knex('users').where({'id':request}).select('walletAddress')
		.then(function(result){
			if(result.length)
				return result[0];
			return ;	
		})
};


module.exports={investorpublickey,userWalletAddress};