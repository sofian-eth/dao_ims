
const db = require('../db.js');
const knex = db.knex;

async function areaSelectionMatrix(projectID){

    return knex('propertyselectionmatrixenum as ps')
    .join('areamatrixenum as a','ps.areaMatrixID','=','a.id')
    .where({'ps.propertyID': projectID})
    .select('ps.propertyID','ps.areaMatrixID','ps.areaUnits','a.name')
        .then(function(result){
            let response = result;
           
            return response;
        })
        .catch(function(error){
            throw error;
        })

}

async function getMinimumAreaDemarcatedUnits(propertyID) {
    return knex.raw('CALL sp_get_investment_unit_selection(?)', [propertyID])
    .then(res => {
        if( res && res.length>0 && res[0] && res[0].length>0 ) {
            const data = res[0][0];
            if( Array.isArray(data) ) {
                return data.filter(item => {
                    item.developmentRounds = item.developmentRounds ? JSON.parse(item.developmentRounds) : [];
                    return item;
                });
            } else {
                return [];
            }
        }
        return [];
    });
}


async function areaMatrixDetail(projectID,areaMatrixID){
    return knex('propertyselectionmatrixenum')
    .where({projectID:projectID,areaMatrixID:areaMatrixID})
    .select('areaUnits')
    .then(function(result){
        let response = result;
        if(result.length)
        response = result[0];
    return response;
    })
    .catch(function(error){
        throw error;
    })
}

module.exports.areaSelectionMatrix = areaSelectionMatrix;
module.exports.areaMatrixDetail = areaMatrixDetail;
module.exports.getMinimumAreaDemarcatedUnits = getMinimumAreaDemarcatedUnits;