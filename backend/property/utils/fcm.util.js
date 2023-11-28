const axios = require("axios");
const { knex } = require('../Models/db');
const moment = require('moment');
/**
 * 
 * @param {String} title 
 * @param {String} body 
 * @param {String} link 
 * @param {Array<String> } to 
 * @param {String} icon
 * @returns {Promise<any>}
 */
const sendNotification = (title,body,link,to,icon=process.env.ASSETS_URL+"DAO%20BLOC@2x.png") =>{

    const payload = {
        "notification": {
            "title": title,
            "body": body,
            "click_action": link,
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

async function insertNotificationData(obj) {
    let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    obj.forEach(x => {
        x.createdAt = date.toString();
        x.updatedAt = date.toString();
        x.isDeleted = 0;
        x.logo = '';
        x.fromName = '';
        x.readBit = 0;
    })
    obj.forEach(x => {
        let result = "INSERT INTO `notificationCenter` (`title`,`description`,`redirectLink`,`from`,`fromName`,`to`,`readBit`,`type`,`logo`,`createdAt`,`updatedAt`,`isDeleted`) VALUES (?)";
        return knex.raw(result, [[x.title, x.description, x.redirectLink, x.from, x.fromName, x.to, x.readBit, x.type, x.logo, x.createdAt, x.updatedAt, false]])
        .then(result => {
            return result;
        })
        .catch(err => {
            throw err;
        })
    })
}

async function getDeviceToken(transactionId) {
    let result = "call sp_get_device_tokens_for_notification_by_transaction(?, 'RECIEVE_PAYMENT_UPLOAD_PUSH_NOTIFICATIONS')";
    return knex.raw(result, [transactionId])
        .then(result => {
            return result;
        })
        .catch(err => {
            throw err;
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

async function getDeviceTokenByPropertyId(propertyId) {
    let result = "call sp_get_device_tokens_for_notification_by_property_id(?, 'RECIEVE_PAYMENT_UPLOAD_PUSH_NOTIFICATIONS')";
    return knex.raw(result,[propertyId] )
        .then(result => {
            return result;
        })
        .catch(err => {
            throw err;
        })
}


module.exports = {sendNotification, getDeviceToken,getDeviceTokenByPropertyId, uploadReceiptNotification, insertNotificationData};