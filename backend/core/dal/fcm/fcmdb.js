const db = require('../../dbModels/index');
const {QueryTypes} = require('sequelize')
const fcmDb = {
    /**
     * 
     * @param {*} query 
     * @param {Array<any>} data 
     * @returns  {Promise<any>}
     */
    execSelect : async function(query,data){
        return await db.sequelize.query(query,{replacements:data,type:QueryTypes.SELECT});
    },
    /**
     * 
     * @param {*} query 
     * @param {Array<any>} data 
     * @returns  {Promise<any>}
     */
    execInsert : async function(query,data){
        return await db.sequelize.query(query,{replacements:data,type:QueryTypes.INSERT});
    },
    /**
     * 
     * @param {*} query 
     * @param {Array<any>} data 
     * @returns  {Promise<any>}
     */
    execUpdate: async function(query,data){
        return await db.sequelize.query(query,{replacements:data,type:QueryTypes.UPDATE});
    }

}
module.exports = fcmDb;