const { sendEidiRequest } = require("../../../dto/sendEidiRequest");
const eidiService  = require("../../../services/eid/daoEidi.service");
// const { sendDAOEidi, getEidiRecievedDB,getEidiSentDB  } = require("../../../services/eid/daoEidi.service");


const controller = {};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */


controller.sendEidi = async function (req, res, next) {
    return eidiService.sendDAOEidi(req,res)
}

controller.getEidiRecieved = async function (req, res, next) {
    req.body["userId"] = req.query.id; 
    req.body["email"] = req.query.email; 
    return eidiService.getEidiRecievedDB(req,res);
}

controller.getEidiSent = async function (req, res, next) {
    req.body["userId"] = req.query.id; 
    return eidiService.getEidiSentDB(req,res);
}

controller.getEidiCount = async function (req, res, next) {
    req.body["userId"] = req.query.id;
    req.body["email"] = req.query.email; 
    return eidiService.getEidiCountDB(req,res);
}

controller.searchUser = async function (req, res, next) {
    req.body["searchText"] = req.query.text; 
    return eidiService.searchUser(req,res);
}



module.exports = controller;