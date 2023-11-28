const db = require('../db');
const knex = db.knex;


const propertyinfo = function(projectID){

    return knex('property').where({id:projectID}).select('*')
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })

}


const updatepropertyinfo = function(req){


    return knex('property').where({id:req.projectID}).update({description:req.description,location:req.location})
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })

}

module.exports = {propertyinfo,updatepropertyinfo};