const db = require('../db.js');
const knex = db.knex;
const statusEnum = require('../../resources/statusEnum');

async function projectListing(userId){
    const result = await knex.raw('CALL sp_get_properties(?)', [userId]);
    
    return result.length > 0 ? result[0].length > 0 ? result[0][0] : [] : [];
    // return knex('property as p')
    // .join('statusenum as s','p.statusID','=','s.id')
    // .join('propertystats as ps','p.id','ps.propertyID')
    // .select('p.*','s.name as status','ps.*')
    // .where('p.status',statusEnum.active)
    //     .then(function(result){
    //         return result;
    //     })
    //     .catch(function(error){
    //         throw error;
    //     })

}


async function propertyOwnerInformation(){

    return knex('property as p')
        .join('users as u','p.ownerID','=','u.id')
        .select('p.blockchainMainContract','u.walletAddress','p.id','p.ownerID as userId','p.id')
        .then(function(result){
            console.log(result);
            return result;
        })
        .catch(function(error){
            console.log(error);
            throw error;
        })
}


module.exports.projectListing = projectListing;
module.exports.propertyOwnerInformation = propertyOwnerInformation;