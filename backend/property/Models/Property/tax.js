const db = require('../db.js');
const knex = db.knex;



async function propertyTax(projectID){
   return knex('propertytaxes')
    .where({propertyID: projectID})
    .select('price')
    .then(function(result){
        return result;
    })
    .catch(function(error){
        throw error;
    })
}

module.exports.propertyTax = propertyTax;