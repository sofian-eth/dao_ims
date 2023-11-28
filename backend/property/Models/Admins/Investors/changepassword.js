const db = require('../../db');
const knex = db.knex;
const dotenv = require('dotenv');
dotenv.config();

const saltRounds = process.env.bcryptsaltrounds;
var bcrypt = require('bcryptjs');

const changepassword = function(formdata){

    return bcrypt.hash(formdata.passwords.investorpassword,Number(saltRounds))
        .then(function(hash){
            return knex('users').where({id:formdata.investorid}).update({password:hash});
        })
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })

}




module.exports={changepassword};