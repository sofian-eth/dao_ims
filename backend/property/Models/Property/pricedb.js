const db = require('../db');
const knex = db.knex;





const pricedb = function () {

    return knex('statusenum').where({ name: 'Active' }).select('id')
        .then(function (result) {
            return knex('developmentrounds').where({ statusID: result[0].id }).select('pricePerSqft', 'marketPrice');
        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;

        })



}

const devRoundPrice = function (roundID) {

    return knex('developmentrounds').where({ id: roundID }).select('pricePerSqft', 'marketPrice','roundName')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}


const activeRoundPrice = function () {

    return knex('statusenum').where({ name: 'Active' }).select('id')
        .then(function (result) {
            return knex('developmentrounds').where({ statusID: result[0].id }).select('pricePerSqft');
        })
        .then(function (result) {
            if (!result)
                throw 'Active round not found';
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}



const projectRoundPrice = function (projectID) {

    return knex('statusenum').where({ name: 'Active' }).select('id')
        .then(function (result) {
            return knex('developmentrounds').where({ propertyID: projectID, statusID: result[0].id }).select('pricePerSqft');
        })
        .then(function (result) {
            if (!result.length)
                throw 'record not found';
            result = result[0];    
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}

module.exports = { pricedb, devRoundPrice, activeRoundPrice,projectRoundPrice };