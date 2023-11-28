
const db = require('../db.js');
const knex = db.knex;




async function fetchSalesAgentDetails(AgentCode) {
	return knex('users').where({ membershipNumber: AgentCode }).orWhere({ id: AgentCode }).select('id', 'firstName', 'lastName', 'email', 'legalName', 'phoneNumber')
		.then(function (result) {
			let response = result;
			if (result.length)
				response = result[0];
			else{
				response={};
			}
			return response;
		})
		.catch(function (error) {
			throw error;
		})
}




module.exports = { fetchSalesAgentDetails };