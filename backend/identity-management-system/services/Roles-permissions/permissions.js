const permissionModel = require("../../models/Permissions");
const { QueryTypes } = require("sequelize");
const { permissions } = require("../../models/index");
async function addPermissions(req, res, next) {
  try {
    let addPermissions = await permissions.create({
      name: req.body.permissionName,
    });
    return res
      .status(200)
      .json({ error: false, message: "Permission added successfully" });
  } catch (error) {
    let err = {};
    err.statusCode = 400;
    err.message = "Error occurred in adding permissions";
    err.stackTrace = error;
    next(err);
  }
}

async function fetchPermissions(req, res, next) {
  try {
    let permissionsList = await permissions.findAll({
      attributes: ["id", "name"],
    });
    permissionsList.forEach(function (e) {
      e.dataValues["enabled"] = false;
    });

    return res
      .status(200)
      .json({ error: false, message: "", data: permissionsList });
  } catch (error) {
    let err = {};
    err.statusCode = 400;
    err.message = "Error occurred in fetching permissions";
    err.stackTrace = error;
    next(err);
  }
}

async function fetchPermissionByID(roleID) {
  try {
    let rawQuery =
      "select p.name as permissionName from rolePermissions as rp inner join roles as r on r.id = rp.roleID inner join permissions as p on p.id= rp.permissionID where r.id=?";
    let queryResult = await sequelize.query(rawQuery, {
      replacements:[roleID],
      type: QueryTypes.SELECT,
    });
    let permissions = [];
    queryResult.forEach((element) => {
      permissions.push(element.permissionName);
    });

    return permissions;
  } catch (error) {
    throw error;
  }
}

module.exports.addPermissions = addPermissions;
module.exports.fetchPermissions = fetchPermissions;
module.exports.fetchPermissionByID = fetchPermissionByID;
