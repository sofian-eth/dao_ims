
const {roles,rolePermissions} = require('../../models/index');
const { QueryTypes, Sequelize } = require("sequelize");
const Op = Sequelize.Op;

async function addRoles(req, res, next) {
    let transaction;
    try {

        let rolePermission = [];
        transaction = await sequelize.transaction();
        let permissionSet = req.body.permissions;
        let role = await roles.create({ name: req.body.roleName }, { transaction });
        for (var i = 0; i < permissionSet.length; i++) {
            let object = {};
            object.roleID = role.dataValues.id;
            object.permissionID = parseInt(permissionSet[i]);
            rolePermission.push(object);
        };
        let rolesRemoval = await rolePermissions.destroy({ where: { roleID: role.dataValues.id } }, { transaction });
        let rolesPermissionResult = await rolePermissions.bulkCreate(rolePermission, { transaction });
        await transaction.commit();
        return res.status(200).json({ error: false, message: 'Role added successfully' });

    } catch (error) {

        if (transaction) await transaction.rollback();
        let err = {};
        err.statusCode = 400;
        err.message = 'Error occurred in adding role. Please check if role is created before';
        err.stackTrace = error;
        next(err);
    }
}


async function updateRoles(req, res, next) {

    let transaction;
    try {

        let rolePermission = [];
        transaction = await sequelize.transaction();
        let permissionSet = req.body.permissions;

        for (var i = 0; i < permissionSet.length; i++) {
            let object = {};
            object.roleID = req.body.roleID;
            object.permissionID = parseInt(permissionSet[i]);
            rolePermission.push(object);
        };
        let rolesRemoval = await rolePermissions.destroy({ where: { roleID: req.body.roleID } }, { transaction });
        let rolesPermissionResult = await rolePermissions.bulkCreate(rolePermission, { transaction });
        await transaction.commit();
        return res.status(200).json({ error: false, message: 'Role updated successfully' });

    } catch (error) {

        if (transaction) await transaction.rollback();
        let err = {};
        err.statusCode = 400;
        err.message = 'Error occurred in updating role';
        err.stackTrace = error;
        next(err);
    }


}



async function removeRoles(req, res, next) {
    let transaction;
    try {

        transaction = await sequelize.transaction();
        await rolePermissions.destroy({ where: { roleID: req.body.roleID } }, { transaction });
        await roles.destroy({ where: { id: req.body.roleID } }, { transaction });
        await transaction.commit();
        return res.status(200).json({ error: false, message: 'Role removed successfully' });
    } catch (error) {
        if (transaction) await transaction.rollback();
        let err = {};
        err.statusCode = 400;
        err.message = 'Error occurred in removing role';
        err.stackTrace = error;
        next(err);
    }
}


async function fetchRoles(req, res, next) {
    let err = {};
    try {
        let rawQuery = "select count(users.id) as users,roles.name,roles.id from roles left join users on users.roleID = roles.ID group by roles.name;";
        let queryResult = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });
        return res.status(200).json({ error: false, message: '', data: queryResult });
    } catch (error) {

        err.statusCode = 400;
        err.message = 'Error occurred in fetching roles';
        err.stackTrace = error;
        next(err);
    }
}


async function fetchRoleDetails(req, res, next) {
    let err = {};
    try {

        let rawQuery = "select r.name as roleName,p.name as permissionName,r.id as roleID,p.id as permissionID from rolePermissions as rp inner join roles as r on r.id = rp.roleID inner join permissions as p on p.id= rp.permissionID where r.id=?";
        let queryResult = await sequelize.query(rawQuery, {replacements:[req.query.roleID], type: QueryTypes.SELECT });
        return res.status(200).json({ error: false, message: '', data: queryResult });
    } catch (error) {

        err.statusCode = 400;
        err.message = 'Error occurred in fetching role details';
        err.stackTrace = error;
        next(err);
    }
}


async function teamRoles(req, res, next) {
    let err = {};
    try {

        let fetchTeamRoles = await roles.findAll(
            {
                where: {
                    name: {
                        [Op.notLike]: "INVESTOR"
                    }
                }
            }
        );

        return res.status(200).json({ error: false, message: "", data: fetchTeamRoles });

    } catch (error) {
        console.log(error);
        err.statusCode = 400;
        err.message = "Error occurred in fetching team roles";
        err.stackTrace = error;
        next(err);
    }
}


module.exports.addRoles = addRoles;
module.exports.removeRoles = removeRoles;
module.exports.fetchRoles = fetchRoles;
module.exports.updateRoles = updateRoles;
module.exports.fetchRoleDetails = fetchRoleDetails;
module.exports.teamRoles = teamRoles;