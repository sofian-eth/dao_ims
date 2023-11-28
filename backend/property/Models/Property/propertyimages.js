
const db = require('../db.js');
const knex = db.knex;
const statusEnum = require('../../resources/statusEnum');
async function projectImages(projectID){

    return knex
    .select('propertygallery.mediaID')
    .from('propertygallery')
    .innerJoin('property','property.id','propertygallery.propertyID')
    .where({'property.id':projectID,'property.status':statusEnum.active,'propertygallery.isDeleted':false})
    .orderBy('propertygallery.id','desc')
    .whereNotNull('propertygallery.mediaID')
        .then(function(result){
            let response = result;
           
            return response;
        })
        .catch(function(error){
            throw error;
        })

}


async function projectVideos(projectID){
    return knex
    .select('propertygallery.videoid')
    .from('propertygallery')
    .innerJoin('property','property.id','propertygallery.propertyID')
    .where({'property.id':projectID,'property.status':statusEnum.active,'propertygallery.isDeleted':false})
    .whereNotNull('propertygallery.videoid')
    .orderBy('propertygallery.id','desc')
        .then(function(result){
            let response = result;
           
            return response;
        })
        .catch(function(error){
            throw error;
        })
}
module.exports.projectImages = projectImages;
module.exports.projectVideos = projectVideos;