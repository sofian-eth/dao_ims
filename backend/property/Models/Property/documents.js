const db = require('./../db');
const knex = db.knex;
const core = require('core');
const statusEnum = require('../../resources/statusEnum');


// Obselete Function



const alldocuments = function(document,projectID){
    
    return knex('propertydocuments').where({documenttype:document,propertyID:projectID,isDeleted:false}).select('*')
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })



}


async function fetchDocuments(propertyId){
    let response=[];
    return knex('propertydocuments')
          .join('media','media.id','propertydocuments.mediaId')
          .join('property','property.id','=','propertydocuments.propertyId')
          .where({'propertydocuments.propertyId':propertyId,'property.status':statusEnum.active,'propertydocuments.isDeleted':false}).select('media.relativePath','propertydocuments.title','propertydocuments.documentType','media.createdAt','media.updatedAt')
        .then(function(result){
            if(!result.length)
               return response;
            let mypromise =  new Promise(function (resolve, reject) {

                result.forEach(x => {

                    core.fileuploader.getMedia(x.relativePath).then(function (url) {

                         response.push({
                            originalFileName: x.title,
                            documentType: x.documentType,
                            url: url,
                            createdAt: x.createdAt,
                            updatedAt: x.updatedAt
                        });

                        resolve(response);
                    });
                });                            
            });

            return mypromise.then(function (params) {
                return params;
            })
        })

        .catch(function(error){
            throw error;
        })
}


const adddocument = function(request){
    return knex('propertydocuments').insert({documentid:request.id,propertyid:request.projectID,documenttype:request.doctype,title:request.title})
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })
}


module.exports = {alldocuments,adddocument,fetchDocuments};