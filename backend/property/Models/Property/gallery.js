const { knex } = require("../db");


async function fetchGallery(projectID){

    return knex('propertygallery as p')
            .join('media as m','p.mediaId','=','m.id')
            .where({'p.propertyID': projectID})
            .select('m.id','m.isImage')
            .then(function(result){
                return result;
            })
            .catch(function(error){
                throw error;
            })

}


async function updateGallery(projectId,mediaId){
    return knex('propertygallery').insert({propertyID: projectId,mediaId:mediaId})
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })
};



module.exports.fetchGallery = fetchGallery;
module.exports.updateGallery = updateGallery;