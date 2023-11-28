const db = require('../db.js');
const knex = db.knex;


const addmilestones = function (request) {
    request.estimatedDate = null;
    request.completionDate = null;
    if (request && request.status == 'inProgress') {
        request.estimatedDate = request.date;
    } else if (request && request.status == 'completed') {
        request.completionDate = request.date;
    }
    return knex('propertymilestones').insert({
        title: request.milestonedescription,
        description: request.milestonedescription,
        completionProgress: request.completionstatus,
        roundID: request.developmentround,
        status: request.status,
        estimatedDate: request.estimatedDate,
        completionDate: request.completionDate,
    })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}


const updateMilestoneStatus = function (request) {
    request.estimatedDate = null;
    request.completionDate = null;
    if (request && request.status == 'inProgress') {
        request.estimatedDate = request.date;
    } else if (request && request.status == 'completed') {
        request.completionDate = request.date;
    }
    return knex('propertymilestones').update({
        completionProgress: request.completionstatus,
        status: request.status,
        estimatedDate: request.estimatedDate,
        completionDate: request.completionDate,
    }).where({ id: request.id })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}

module.exports = { addmilestones, updateMilestoneStatus };