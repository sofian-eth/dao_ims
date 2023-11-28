
const db = require('../db.js');
const knex = db.knex;

const milestonedetails = function(propertyid,devid){


    
    return knex('propertymilestones').where({roundID:devid}).select('*')
        .then(function(result){
            debugger
            return result;
        })
        .catch(function(error){
            throw error;
         })



    

}


async function projectMilestones (projectID){
    return knex('propertymilestones as pm')
            .join('developmentrounds as d','d.id','=','pm.roundID')
            .join('property as p','p.id','=','d.propertyID')
            .join('statusenum as s','s.id','=','d.statusID')
            .where('p.id',projectID)
            .where('s.name','Active')
            // .orderBy('pm.completionProgress','desc')
            .orderBy('pm.priorityOrder', 'asc')
            .select('p.name as propertyName','p.coverPhoto','pm.title','pm.completionProgress','pm.updatedAt','p.propertySymbol','pm.estimatedDate','pm.completionDate','pm.status')
            
            .then(function(result){
                return result;
            })
            .catch(function(error){
                throw error;
            })
}

module.exports={milestonedetails,projectMilestones};