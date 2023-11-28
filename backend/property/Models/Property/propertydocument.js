
const db = require('../db.js');
const knex = db.knex;
const statusEnum = require('../../resources/statusEnum');
async function projectDocument(projectID){

    return knex
    .select('propertydocuments.*')
    .from('propertydocuments')
    .innerJoin('property','property.id','propertydocuments.propertyID')
    .where({'property.id':projectID,'property.status': statusEnum.active,'propertydocuments.isDeleted':false})
        .then(function(result){
            let response = result;
           
            if(result.length)
                response = result;
            return response;
        })
        .catch(function(error){
    
            throw error;
        })

}

module.exports.projectDocument = projectDocument;