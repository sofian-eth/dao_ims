
const db  = require('../../db.js');
const knex = db.knex;


const investors = function(){


    return knex('users')
    .where({roleID:1})
    .orderBy('createdAt','desc')
    .select('id','membershipNumber','firstName','lastName','email','phoneNumber','createdAt')
        .then(function(result){
            return result;
        })
        .catch(function(error){
           
            throw error;
        })
}
const getMarketplaceUsersDeviceToken = function(){
    let query = `select distinct u.id,u.device_token from users u join roles r on u.roleID =r.id join rolePermissions rP on r.id = rP.roleID join permissions p on rP.permissionID = p.id  and p.name in('MARKETPLACE_VIEW','MARKETPLACE_ADD', 'MARKETPLACE_EDIT', 'SIDEBAR_ADMIN_VIEW_MARKETPLACE') where ifnull(u.device_token,'') !='';`;
    return knex.raw(query).then(x=>{
        if(x.length>0){
            return x[0]
        }else{
            return []
        }
    });
}

const userPortfolio = function(userID=0) {
    return knex.raw(`CALL sp_get_user_portfolio(${userID})`).then(x => {
        if(x.length>0){
            return x[0].length > 0 ? x[0][0] : null;
        }else{
            return null
        }
    })
}

const userPortfolioBalance = async function(userID=0) {
    const result = await knex.raw("CALL sp_demarcated_properties(?)", [userID], );
    if(result.length>0) {
        return result[0].length > 0 ?  result[0][0].map(item => {
            item.areaSpaceTypes = item.areaSpaceTypes ? JSON.parse(item.areaSpaceTypes) : [];
            item.premiumCategories = item.premiumCategories ? JSON.parse(item.premiumCategories) : [];
            item.demarcatedPlans = item.demarcatedPlans ? JSON.parse(item.demarcatedPlans) : [];
            item.demarcatedFloors = item.demarcatedFloors ? JSON.parse(item.demarcatedFloors) : [];
            item.demarcatedFilters = item.demarcatedFilters ? JSON.parse(item.demarcatedFilters) : [];
            item.unitTypesCounts = item.unitTypesCounts ? JSON.parse(item.unitTypesCounts) : [];
            const demarcationConfig = (item.demarcationConfig) ? JSON.parse(item.demarcationConfig) : {}; 
            item.usageTypes = demarcationConfig.usageTypes ? demarcationConfig.usageTypes : [];
            return item;
        }) : [];
    } else {
        return [];
    }
}

const activateProperty = async function(propertyID) {
    console.log('propertyID',propertyID);
    const result = await knex.raw(`update property set status = 'Active' where id=${propertyID}`);
    if(result.length>0) {
        return result[0];
    } else {
        return [];
    }
}

const launchDate = async function(propertyID) {
    const result = await knex.raw(`select name,id,status,launchDate from property where id=${propertyID}`);
    if(result.length>0) {
        return result[0];
    } else {
        return [];
    }
}

const getDevelopmentRounds = function(propertyId=0) {
    return knex.raw('SELECT * FROM `developmentrounds` WHERE developmentrounds.propertyID=? ORDER BY developmentrounds.displayStartDate DESC;', [propertyId]).then(x => {
        if(x.length>0){
            return x[0];
        }else{
            return null
        }
    });
};




module.exports={investors,getMarketplaceUsersDeviceToken,userPortfolio,getDevelopmentRounds, userPortfolioBalance,activateProperty,launchDate};

