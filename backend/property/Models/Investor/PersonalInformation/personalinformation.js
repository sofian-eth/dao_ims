

const db = require('../../db.js');
const randomstring = require('randomstring');
const knex = db.knex;



const userPersonalInformation = function (investorID) {
    return knex('users').where({ id: investorID }).select('id', 'firstName', 'lastName', 'legalName', 'email', 'phoneNumber', 'is_email_verified', 'is_phonenumber_verified', 'membershipNumber', 'walletAddress', 'createdAt')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function userInformation(investorID) {
    return knex('users').where({ id: investorID }).select('id', 'firstName', 'lastName', 'legalName', 'email', 'phoneNumber', 'is_email_verified', 'is_phonenumber_verified', 'membershipNumber', 'walletAddress', 'createdAt')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function updateKyc(userId, cnicFrontId, cnicBackId) {
    let cnicFront;
    let cnicBack;

    return knex('users')
        .where({ id: userId })
        .select('cnicFrontID', 'cnicBackID')
        .then(function (result) {
            if (result.length) {
                cnicFront = result[0].cnicFrontID;
                cnicBack = result[0].cnicBackID;

            };

            if (cnicFrontId)
                cnicFront = cnicFrontId;

            if (cnicBackId)
                cnicBack = cnicBackId;

            return knex('users')
                .where({ id: userId })
                .update({ cnicFrontID: cnicFront, cnicBackID: cnicBack });
        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

    // return knex('users')
    //        .where({id: userId})
    //        .update({cnicFrontId: cnicFrontId, cnicBackID:cnicBackId})
    //        .then(function(result){
    //            return result;
    //        })
    //        .catch(function(error){
    //            throw error;
    //        })

}


async function updateCnicFront(userId, cnicFrontId) {
    return knex('users')
        .where({ id: userId })
        .update({ cnicFrontID: cnicFrontId })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
};


async function updateCnicBack(userId, cnicBackId) {
    return knex('users')
        .where({ id: userId })
        .update({ cnicBackID: cnicBackId })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
};

async function updateProfilePic(userId, _profilePicture) {
    return knex('users')
        .where({ id: userId })
        .update({ profilePicture: _profilePicture })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
};



module.exports = { userPersonalInformation, userInformation, updateKyc, updateCnicFront, updateCnicBack, updateProfilePic };
