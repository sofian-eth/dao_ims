const db = require('../../dbModels/index');
const { QueryTypes } = require("sequelize");

async function extendTimeRequest(orderItemID) {
    let createdAt, updatedAt;
    createdAt=new Date(Date.now())
    updatedAt=new Date(Date.now())
    const result = await db.sequelize.query(`INSERT INTO orderTimeExtensionRequests(orderItemID, createdAt, updatedAt) VALUES (?,?,?);`, {replacements:[orderItemID,createdAt,updatedAt], type: QueryTypes.INSERT });
    if (result && result.length > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    extendTimeRequest
};