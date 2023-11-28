const { sendEidiRequest } = require("../../dto/sendEidiRequest");
const emailUtils = require('../../utils/email');
const userInformationModel = require("../../Models/Investor/PersonalInformation/personalinformation");
const core = require('core');

async function sendDAOEidi(req, res, next) {
    let err = {};
    try {
        let data = new sendEidiRequest(req.body);
        // fetch project name
        // send email


        // sender email
        const propertyDetail = await core.propertyDB.getPropertyInformation(data.projectID);
        let userInformation = await userInformationModel.userInformation(
            data.from
          );
        data.projectName = propertyDetail.name;
        data.senderEmail = userInformation[0].email;
        data.senderName = userInformation[0].legalName;

       
        let sql = "INSERT INTO daoproptechdatabasev2.daoEidi (`to`, `from`, `existingUser`, `firstName`, `email`, `phoneNumber`,`sqft`, `projectID`, `createdAt`, `updatedAt`, `message`)" + `VALUES (${data.to},${data.from},${data.existingUser},'${data.firstName}','${data.email}','${data.phoneNumber}',${data.sqft},${data.projectID},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'${data.message}')`;
        const result = await core.db.sequelize.query(sql);
        let sender =  emailUtils.eidi_sender_notification_email(data);
        let receiver =  emailUtils.eidi_receiver_notification_email(data);

        return res.status(200).json({ error: false, message: '', data: 'Data Updated Successfully' });


    } catch (error) {
        err.statusCode = 400;
        err.message = "Error occurred in EID API";
        err.stackTrace = error;console.log(error);
        // next(err);

    }
}

async function getEidiRecievedDB(req, res, next) {
    let err = {};
    try {
        let sql = "CALL sp_eidiRecieved(:_email);";
        const result = await core.db.sequelize.query(sql, {
            replacements: {
                _email: req.body.email
            }
        });
        return res.status(200).json({ error: false, message: '', data: result });

    } catch (error) {
        err.statusCode = 400;
        err.message = "Error occurred in EIDI API";
        err.stackTrace = error;console.log(error);
 

    }
}

async function getEidiSentDB(req, res, next) {
    let err = {};
    try {
        let sql = "CALL sp_getEidiSent(:userID);";
        const result = await core.db.sequelize.query(sql, {
            replacements: {
                userID: req.body.userId
            }
        });
        return res.status(200).json({ success: true, message: '', data: result });

    } catch (error) {
        err.statusCode = 400;
        err.message = "Error occurred in EIDI API";
        err.stackTrace = error;console.log(error);
 

    }
}

async function getEidiCountDB(req, res, next) {
    let err = {};
    try {
        let sql = "CALL sp_getEidiCountDB(:userID,:email);";
        const result = await core.db.sequelize.query(sql, {
            replacements: {
                userID: req.body.userId,
                email: req.body.email
            }
        });
        return res.status(200).json({ success: true, message: '', data: result });

    } catch (error) {
        err.statusCode = 400;
        err.message = "Error occurred in EIDI API";
        err.stackTrace = error;console.log(error);
    }
}

async function eidiReceived(email){
    let err= {};

    try {
        let sql = "call sp_receive_dao_eidi(:_email);";
        const result = await core.db.sequelize.query(sql, {
            replacements: {
                _email: email
            }
        });     
        
        if(result)
        return result; 

    } catch(error){
        err.statusCode = 400;
        err.message = "Error occurred in EID API";
        err.stackTrace = error;console.log(error);
    }
}
async function searchUser(req , res){
    let err= {};

    try {

        // let query = "call sp_admin_txt_user_search(?);";
        // const result = await this.db.select(query, [[searchText, clientId,daoUserID]], true);
        let sql = "call sp_admin_txt_user_search(:searchText,:clientId,:daoUserID);"
        const result = await core.db.sequelize.query(sql, {
            replacements: {
                searchText: req.body.searchText,
                clientId : 0,
                daoUserID : 0
            }
        });     
        
        if(result)
        return res.status(200).json({ error: false, message: '', data: result });

        return res.status(200).json({ error: false, message: '', data: [] });

    } catch(error){
        err.statusCode = 400;
        err.message = "Error occurred in EID API";
        err.stackTrace = error;console.log(error);
        
        
    }
}

module.exports.sendDAOEidi = sendDAOEidi;
module.exports.getEidiRecievedDB = getEidiRecievedDB;
module.exports.getEidiSentDB = getEidiSentDB;
module.exports.eidiReceived= eidiReceived;
module.exports.getEidiCountDB = getEidiCountDB;
module.exports.searchUser = searchUser;
