const { knex } = require('../db');
const db = require('../db');
var parser = require('ua-parser-js');
const accountActivity = function (request) {
    let date = new Date();
    let userAgent = request.userAgent;
    let ua = parser(userAgent);
    let browser = ua.browser.name + ' ' + ua.browser.version;
    let os = ua.os.name + ' ' + ua.os.version;
    return knex('lov').where({ name: request.subject }).select('id')
        .then(function (result) {
            if (!result.length)
                return knex('lov').insert({ name: request.subject }).returning('id');
            else
                return result;

        })
        .then(function (result) {
           
            return knex('accountactivity').insert({ subjectID: result[0].id, action: request.action, userID: request.userID, userAgent: request.userAgent, IPAddress: request.ipAddress, createdAt: date, updatedAt: date,browser: browser, operatingSystem: os });
        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}

const fetchAccountActivity = function (request) {
    return knex('account-activity as aa').where({ userID: request.userID })
        .join('lov as lv', 'aa.subjectID', '=', 'lv.id')
        .join('users as u', 'u.id', '=', 'aa.userID')
        .select('aa.action', 'aa.userID', 'lv.name', 'aa.membershipNumber', 'aa.email', 'aa.firstName', 'aa.lastName');
}


const fetchAllActivity = function (request) {
    return knex('account-activity as aa')
        .join('lov as lv', 'aa.subjectID', '=', 'lv.id')
        .join('users as u', 'u.id', '=', 'aa.userID')
        .select('aa.action', 'aa.userID', 'lv.name', 'aa.membershipNumber', 'aa.email', 'aa.firstName', 'aa.lastName');
}

const insertActivityLog = async function(obj) {
    const keys = Object.keys(obj).filter(item => ['logName', 'description', 'subjectID', 'subjectType', 'event', 'causerID', 'causerType', 'properties', 'source', 'metaData','propertyID' ].includes(item) && obj[item]!==undefined);
        if( keys.length > 0 ) {
            let mapping=keys.map(item => ['properties', 'source', 'metadata'].includes(item.toLocaleLowerCase()) ? JSON.stringify(obj[item]) : obj[item]);
            try{
                const result = await knex.raw(`INSERT INTO activityLogs(${keys.join(",")}) VALUES (${keys.map(item => "?").join(",")})`, mapping);
                if( Array.isArray(result) && result.length > 0 ) {
                    obj.id = result[0].insertId;
                    return obj;
                } else {
                    return null;
                }
            }catch(error){
                console.log(error)
            }
        } else {
            return null;
    }
}




module.exports = { accountActivity, fetchAccountActivity, fetchAllActivity, insertActivityLog };