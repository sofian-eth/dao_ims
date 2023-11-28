const axios = require("axios");
const { knex } = require("core/models/db");
/**
 * 
 * @param {String} title 
 * @param {String} body 
 * @param {String} link 
 * @param {Array<String> } to 
 * @param {String} icon
 * @returns {Promise<any>}
 */




 const uploadReceiptNotification = (title,body,to) =>{
    let icon = process.env.ASSETS_URL+"DAO%20BLOC@2x.png";
    const payload = {
        "notification": {
            "title": title,
            "body": body,
            "icon":icon
        },
        "registration_ids": (typeof(to) == "string" || typeof(to)=='number') ? [to] : to
    }
    return axios({
        "method":"POST",
        "url":"https://fcm.googleapis.com/fcm/send",
        headers:{
            'content-type': 'application/json',
            authorization: 'key='+process.env.FCM_SERVER_KEY
        },
        data:payload
    }).then(x=>{
        return x;
    }).catch(x=>{
        return x;
    })
}

async function getDeviceToken() {
    let result = "call sp_get_device_tokens_for_notification_by_property_id(NULL, 'RECIEVE_PAYMENT_UPLOAD_PUSH_NOTIFICATIONS')";
    return knex.raw(result, )
        .then(result => {
            return result;
        })
        .catch(err => {
            throw err;
        })
}


async function getDeviceTokenByPropertyId() {
    let result = "call sp_get_device_tokens_for_notification_by_property_id(?, 'RECIEVE_PAYMENT_UPLOAD_PUSH_NOTIFICATIONS')";
    return knex.raw(result, )
        .then(result => {
            return result;
        })
        .catch(err => {
            throw err;
        })
}


module.exports = {uploadReceiptNotification, getDeviceToken, getDeviceTokenByPropertyId}