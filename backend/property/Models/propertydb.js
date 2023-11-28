var db = require('./db.js');
var knex = db.knex;



const getfundingmilestonedetails = function () {
    return knex('developmentrounds').where({ propertyID: 1, statusID: 8 }).select('id')
        .then(function (result) {

            if (!result.length)
                return [];
            return knex('propertymilestones').where({ roundID: result[0].id }).orderBy('completionProgress','desc');
        })
        .then(function (result) {

            return result;
        })
        .catch(function (error) {

            throw error;
        })

}
const getfundingroundssummary = function () {

    var fundingroundsummary = {};

    return knex('developmentrounds').where({ status: 'Active' })
        .then(function (result) {
            fundingroundsummary['ActiveRound'] = result;
            return knex('developmentrounds').where({ status: 'Upcoming' }).orderBy('startdate').limit(1);
        })
        .then(function (result) {
           
            fundingroundsummary['UpcomingRound'] = result;
            return fundingroundsummary;
        })
        .catch(function (error) {
            throw error;

        })



}

const getcurrentprice = function () {
    return knex('propertypricehistorytable').where({ propertyid: 1 }).orderBy('created_at', 'desc').limit(1).select('propertyvalue')
        .then(function (result) {
           
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}

const gettaxes = function () {
    return knex('propertytaxes').join('taxenum', 'propertytaxes.taxid', '=', 'taxenum.id').select('propertytaxes.price', 'taxenum.taxdescription')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        });


}




const getactivedevelopmentrounds = function () {

    return knex('statusenum').where({ name: 'Active' }).select('id')
        .then(function (result) {
            return knex('developmentrounds').where({ statusID: result[0].id, propertyID: 1 }).limit(1).select('id','roundName');
        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}




module.exports = { getfundingmilestonedetails, getfundingroundssummary, getcurrentprice, gettaxes, getactivedevelopmentrounds };