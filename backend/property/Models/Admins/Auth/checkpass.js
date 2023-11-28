const db = require('../../db.js');
const knex = db.knex;
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const checkpass =  function(adminid,body){
    return knex('users').where({id:adminid}).select('password')
        .then(function(result){
            
            return bcrypt.compare(body.password || body.pass,result[0].password)  

        })
        .then(function(result){
        
            return result;
        })
        .catch(function(error){
        
            throw error;

        })

}

const checkUsernamePassword =  function(username,password){
   
    return knex('users').where({email:username})
        .then(function(result){
            return result.length > 0 && bcrypt.compare(password,result[0].password) ? result[0] : null;
        })
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;

        })
}

const rolePermissions = async (roleID) => {
    const rolePermissions =  await knex('rolePermissions').join('permissions', 'rolePermissions.permissionID', '=', 'permissions.id').where({"rolePermissions.roleID":roleID});
    return rolePermissions.map(item => item.name);
};

const getSuspendedStatus = async(id) =>{
let q = await knex('users').where({id:id}).select('isSuspend');
return q;
}


module.exports={checkpass, checkUsernamePassword, rolePermissions , getSuspendedStatus};