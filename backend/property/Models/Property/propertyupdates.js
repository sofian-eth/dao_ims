

const db = require('../db.js');
const knex = db.knex;


const propertyupdates = function(formdata){

  
var updatetag = [];
var tagarray = formdata.tags;
    return knex('propertyupdates').insert({title:formdata.title,descriptions:formdata.description,url:formdata.url})
        .then(function(result){
            return knex('propertyupdates').where({title:formdata.title}).where({descriptions:formdata.description}).select('id');
        })
        .then(function(result){
            tagarray.forEach(element => {
               updatetag.push({updateid:result[0].id,tagid:element.value});
            });

            return knex('propertyupdatestag').insert(updatetag);
            
        })
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        });


}

const getupdates = function(){

   

  return knex('propertyupdates').select('id','title','description','url','createdAt').orderBy('createdAt')
                                  .then(function(result){
                                   return result;
                                   })
                                   .catch(function(error){
                                      
                                      throw error;
  });  

}


module.exports={propertyupdates,getupdates};
