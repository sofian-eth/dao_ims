const db = require("../../index");
const moment = require("moment");
const NOTIFICATION_ENUM = {
        "WELCOME":"Welcome",
        "PLEDGE":"Pledge",
        "PAYMENT":"Payment",
        "TRANSACTION":"Transaction",
        "ADVANCE_BOOKING":"Advance Booking",
        "PROFILE":"Profile",
        "REQUEST":"Request",
        "APPROVED":"Approved",
        "REJECT":"Reject",
        "ORDER":"Order",
        "BID":"Bid",
        "BANK":"Bank",
        "PAYMENT":"Payment",
        "CHAT":"Chat",
        "SERVICE_CHARGES":"Service Charges",
        "RELEASE":"Release",
        "REVIEW":"Review",
        "PROJECT_LOGO":"Project Logo",
        "ROUND_LOGO":"Round Logo",
        "MODULE_LOGO":"Module Logo",
        "ROUND_END":"Round End",
        "USER_REVIEW_APPROVED": "USER_REVIEW_APPROVED",
        "USER_REVIEW_REMINDER": "USER_REVIEW_REMINDER",
        "P2P_TRANSFER":"P2P Transfer",
        "P2P_RECEIVER":"P2P Receiver",
        "P2P_APPROVED":"P2P APPROVED",
    }
class notificationModel {
    
    /**
     * 
     * @param {notificationModel} obj 
     */
    constructor(obj = {}){
        this.title=obj.title?obj.title:'',
        this.description=obj.description?obj.description:'',
        this.redirectLink=obj.redirectLink?obj.redirectLink:'',
        this.from=obj.from?obj.from:0,
        this.fromName=obj.fromName?obj.fromName:'',
        this.to=obj.to?obj.to:0,
        this.readBit=obj.readBit?obj.readBit:0,
        this.type=obj.type?obj.type:'',
        this.logo=obj.logo?obj.logo:''
    }
    create(){
        let query ="INSERT INTO `notificationCenter`(`title`,`description`,`redirectLink`,"
        +"`from`,`fromName`,`to`,`type`,`logo`,`createdAt`,`updatedAt`,`isDeleted`) VALUES ?";
        let data = [[this.title,this.description,this.redirectLink,
            this.from,this.fromName,this.to,this.type,this.logo,moment(new Date()).format(),moment(new Date()).format(),0]];
        return db.fcmDb.execInsert(query,[data]);
    }
    /**
     * 
     * @param {Number} userID 
     * @returns {Promise<notificationModel>}
     */
    list(userID){
        let query = "SELECT * FROM `notificationCenter` where `to` = ?;";
        let data = [userID];
        return db.fcmDb.execSelect(query,data);
    }
}

module.exports = {notificationModel,NOTIFICATION_ENUM}