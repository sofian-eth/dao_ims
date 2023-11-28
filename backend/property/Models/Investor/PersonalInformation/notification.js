const db = require('../../db');
const knex = db.knex;

const notificationcount = function(userid){


    return knex('user_notifications').where({userid:userid}).where({isread:0}).count('id')
        .then(function(result){
            
            return result;
        })
        .catch(function(error){
            throw error;
        })

}

const notificationdetails = function(userid){
    return knex('user_notification').where({userid:userid}).where({isread:0}).select('title','description','url','created_at')
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })
}


const notificationread = function(userid,notificationid){
    return knex('user_notification').where({userid:userid}).where({id:notificationid}).update({isread:1})
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })
}


const dismissnotifications = function(userid){
    return knex('user_notification').where({userid:userid}).update({isread:1})
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })
}

module.exports = {notificationcount,notificationdetails,notificationread,dismissnotifications};

