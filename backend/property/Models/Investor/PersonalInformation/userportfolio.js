
const db = require('../../db.js');
const core = require('core');
const knex = db.knex;



async function activeInvestments(userId, projectID=null, startDate=null, endDate=null){

	const result = await knex.raw(`CALL sp_get_user_active_investments(?, ?, ?, ?)`, [userId, projectID, startDate, endDate]);
	if( result.length > 0 && result[0].length > 0 ) {
		return result[0][0];
	} else {
		return [];
	}

	// return knex('portfoliobalance as pb')
	// 		.join('users as u','pb.userID','=','u.id')
	// 		.join('property as p','pb.propertyID','=','p.id')
	// 		.join('propertystats', 'pb.propertyID', '=', 'propertystats.propertyID')
	// 		.where('pb.userID',userId)
	// 		.select('p.name as propertyName','p.id as propertyId','p.coverPhoto','pb.balance','pb.netInvestment as purchasedPrice', 'propertystats.expectedmaturitydate', 'propertystats.completionArea','p.propertyLogo')
	// 		.then(function(result){
	// 			return result;
	// 		})
	// 		.catch(function(error){
	// 			throw error;
	// 		})	


}
async function getUnlockedArea(userId,propertyId){
	let result = await core.db.sequelize.query(`call sp_get_user_projects_sell_area(${userId});`);
	console.log("result", result);
	if( result && result.length > 0 ) {
		const prop = result.filter(prop => prop.propertyId==propertyId);
		if( prop.length > 0 ) {
			return prop.pop();
		} else {
			return null;
		}
	} else {
		return null;
	}
	// return knex.raw(`select * from userArea where userID = ${userId} and propertyID = ${propertyId};`).then(function(result){
	// 	return result[0]
	// }).catch(function(error){
	// 	throw error;
	// });
}

async function reserveInvestments(userId){
	return knex.raw(`select t.propertyID,sum(t.totalPrice) as reserveAreaPrice,sum(t.areaPledged) as reserveArea 
				from developmentrounds as d 
				join tradeactivity as t on t.roundID = d.id
				where d.statusID=9 and t.buyerID=${userId} and t.internalStatus='approved'
				group by t.propertyID;`)
			.then(function(result){
				return result[0];
			})
			.catch(function(error){
				throw error;
			})	


}
async function estimation(userId){
	let query=`select  
	(marketPrice*pb.balance) marketNetCompletion,
	(pricePerSqft*pb.balance) blocNetCompletion,
	pb.netInvestment,
	dt.pricePerSqft as price,
	dt.marketPrice,
	dt.propertyID
	from developmentrounds dt 
	join portfoliobalance pb on dt.propertyID = pb.propertyID and dt.id in (select MAX(id) from developmentrounds group by propertyID) and pb.userID = ? group by dt.propertyID;`;
	return knex.raw(query,[userId]);
}
async function totalPurchasedArea(userId) {
	return knex('portfoliobalance as pb')
			.where('pb.userID',userId)
			.sum('pb.balance as totalArea')
			.then(function(result){
				return result.length > 0 ? result.pop().totalArea : 0;
			})
			.catch(function(error){
				throw error;
			});
}


async function userBalance(userId,propertyId){
	let balance = 0;
	return knex('portfoliobalance')
			.where({userID:userId,propertyID: propertyId})
			.select('balance')
			.then(function(result){
			
				if(!result.length)
					return balance;
				balance = result[0].balance;
				return balance;
			})
			.catch(function(error){
				throw error;
			})

}


async function updateUserBalance(userId,propertyId,balance){
	return knex('portfoliobalance')
			.where({userID: userId,propertyID: propertyId})
			.update({userID: userId,propertyID: propertyId,balance: balance})
			.then(function(result){
				return true;
			})
			.catch(function(error){
				return false;
			})
}

async function getUserRentPayouts(userId) {
	return knex.raw('SELECT * FROM `propertyRentPayouts` WHERE propertyRentPayouts.userID=? ORDER BY propertyRentPayouts.disbursedAt DESC;', [userId])
			.then(result => {
				if( result.length > 0  ) {
					return result[0];
				} else {
					return [];
				}
			})
			.catch(err => {
				throw err;
			})
}

async function totalTranscations(propertyID=1) {
	return knex.raw(`select count(id) as totalTransaction from tradeactivity where propertyID=${propertyID} and statusID in(3,14);`)
			.then(result => {
				if( result.length > 0  ) {
					return result[0][0].totalTransaction;
				} else {
					return [];
				}
			})
			.catch(err => {
				throw err;
			})
}

async function demarcatedAreaUnits(userID) {
	return knex.raw("call sp_demarcated_get_user_area_units(?)", [userID])
		.then(result => {
			if( result.length > 0 ) {
				return (result[0] && Array.isArray(result[0]) && result[0].length > 0 ) ? result[0][0] : [];
			} else {
				return [];
			}
		})
		.catch(err => {
			throw err;
		});
}



module.exports.activeInvestments = activeInvestments;
module.exports.reserveInvestments = reserveInvestments;
module.exports.userBalance = userBalance;
module.exports.totalPurchasedArea = totalPurchasedArea;
module.exports.updateUserBalance = updateUserBalance;
module.exports.estimation = estimation;
module.exports.getUnlockedArea = getUnlockedArea;
module.exports.getUserRentPayouts = getUserRentPayouts;
module.exports.totalTranscations = totalTranscations;
module.exports.demarcatedAreaUnits = demarcatedAreaUnits;

