
const db = require('../../db.js');
const knex = db.knex;


const pledgearea = function (request, investorid, currentprice, totaltax, devround, discount) {
	let date = new Date();
	let queue;
	let paymentdate = new Date();
	paymentdate.setDate(date.getDate() + 7);


	let propertytotalprice = (request.purchasedarea * currentprice);
	propertytotalprice = propertytotalprice + totaltax;

	let salesAgentID = null;

	return knex.transaction(function (tx) {
		return tx('users').where({ membershipNumber: request.agentcode }).select('id')
			.then(function (result) {
				if (result.length)
					salesAgentID = result[0].id;
				return tx('tradeactivity').insert({ sellerID: 2, buyerID: investorid, agentID: salesAgentID, areaPledged: request.purchasedarea, roundID: devround, paymentMode: request.paymentMode, statusID: 2, paymentDate: paymentdate, billingAddress: request.billingAddress, totalPrice: propertytotalprice, propertyID: 1, sqftPrice: currentprice, queueNumber: '', operations: 'buy', createdAt: date, updatedAt: date }, 'id')
			})
			.then(function (result) {
				queue = result[0];
				return tx('tradeactivity').where({ id: queue }).update({ queueNumber: queue });
			})
			.then(function (result) {

				return tx('tradeactivity').where({ id: queue }).select('*')
			})
			.then(function (result) {
				return result;
			})
			.catch(function (error) {
				throw error;
			})
	})






}




// async function areaPledge (request) {



// 	let date = new Date();
// 	let queue;
// 	let paymentDate = new Date();
// 	paymentDate.setDate(date.getDate() + 7);


// 	let propertytotalprice = (request.pledgeArea * request.areaPrice);

// 	let salesAgentID = null;

// 	return knex.transaction(function (tx) {
// 		return tx('users').where({ membershipNumber: request.agentCode }).select('id')
// 			.then(function (result) {
// 				if (result.length)
// 				salesAgentID = result[0].id;
// 				return tx('tradeactivity').insert({ sellerID: 2, buyerID: request.buyerID, agentID: salesAgentID, areaPledged: request.pledgeArea, roundID: request.roundID, paymentMode: request.paymentModeID, statusID: 2, paymentDate:paymentDate , billingAddress: request.billingAddress, totalPrice: propertytotalprice, sqftPrice: request.areaPrice, queueNumber: '', operations: 'buy', createdAt: date, updatedAt: date }, 'id')
// 			 })
// 			.then(function (result) {
// 				queue = result[0];
// 				return tx('tradeactivity').where({ id: queue }).update({ queueNumber: queue });
// 			})
// 			.then(function (result) {

// 				return tx('tradeactivity').where({ id: queue }).select('*')
// 			})
// 			.then(function (result) {
// 				let response = result;
// 				if(result.length)
// 					response = result[0];
// 				return response;
// 			})
// 			.catch(function (error) {
// 				throw error;
// 			})
// 	})






// }


async function areaPledge(data) {

	let date = new Date();
	let queue;
	return knex.transaction(function (tx) {
		return tx('tradeactivity').insert({ sellerID: data.sellerID,propertyID:data.propertyID, 
			buyerID: data.buyerID, agentID: data.agentID, areaPledged: data.areaPledged, 
			roundID: data.roundID, paymentMode: data.paymentMode, statusID: data.statusID, 
			paymentDate: data.paymentDate, billingAddress: data.billingAddress,
			 totalPrice: data.totalPrice, sqftPrice: data.sqftPrice, queueNumber: '', 
			 operations: data.operations, createdAt: date, updatedAt: date ,isDemo:data.isDemo,
			 clientID: data.clientID }, 'id')

			.then(function (result) {
				queue = result[0];
				return tx('tradeactivity').where({ id: queue }).update({ queueNumber: queue });
			})
			.then(function (result) {

				return tx('tradeactivity').where({ id: queue }).select('*')
			})
			.then(function (result) {
				let response = result;
				if (result.length)
					response = result[0];
				return response;
			})
			.catch(function (error) {
				throw error;
			})
	})


}

async function updateAreaPledge(id, data) {
	return knex('tradeactivity')
	.where({
		id
	})	
	.update({
		...data,
		updatedAt: new Date
	});
}

module.exports = { pledgearea, areaPledge, updateAreaPledge };