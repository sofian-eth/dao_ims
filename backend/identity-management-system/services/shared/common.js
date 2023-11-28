const { check } = require("express-validator");
const { Op, QueryTypes } = require("sequelize");
const { ErrorHandler } = require('../../utility/error-handler');
const randomString = require('randomstring');
const sequelize = require('../../utility/dbConnection');
const blockchainModule = require('../../utility/blockchain-query');
const areaConversionUtils = require('../../utility/area-conversion');
const generalSetting = require('../Account-settings/general-settings');
const dotenv = require('dotenv');
dotenv.config();

const {users,paymentModeEnum,phonelookup,lov,accountactivity,tradeactivity,walkthrough} = require('../../models/index');
var parser = require('ua-parser-js');
const { environment } = require("../../utility/keys");
async function checkPhoneNumber(req, res, next) {
    let err = {};
    try {
        let isPhoneNumberExist = await users.findOne({ where: { phoneNumber: req.body.phoneNumber } });
        if (isPhoneNumberExist && isPhoneNumberExist.is_phonenumber_verified)
            throw 'Phone number is associated with another account';

        return res.status(200).json({ error: false, message: "Phone number available", data: "" });


    } catch (error) {
        err.statusCode = 400;
        err.message = 'Phone number is associated with another account';
        err.stackTrace = error;
        next(err);
    }

}

async function getPaymentNumber(req, res, next) {
    let err = {};
    try {

        let paymentInformation = await paymentModeEnum.findAll();


        return res.status(200).json({ error: false, message: "", data: paymentInformation });
    } catch (error) {
        err.statusCode = 400;
        err.message = "An error occurred in fetching payment information";
        err.stackTrace = error;
        next(err);
    }
}

async function checkEmail(req, res, next) {
    let err = {};
    try {
        let isEmailExist = await users.findOne({ where: { email: req.body.email } });
        if (isEmailExist)
            throw new 'Email Address is associated with another account';
        return res.status(200).json({ error: false, message: "Email address available", data: "" });

    } catch (error) {
        err.statusCode = 400;
        err.message = 'Email Address is associated with another account';
        err.stackTrace = error;
        next(err);
    }
}


async function activityLogs(request, message, subject, userID) {

    let err = {};
    let ipAddress = request.headers['x-forwarded-for'];
    if(ipAddress)
     ipAddress = ipAddress.split(',').shift() ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        (request.connection.socket ? request.connection.socket.remoteAddress : null);

    console.log("IP Address",ipAddress);    
    let userAgent = request.headers['x-my-user-agent'] || request.headers['user-agent'];
    let ua = parser(userAgent);
    let browser = ua.browser.name + ' ' + ua.browser.version;
    let os = ua.os.name + ' ' + ua.os.version;

    try {

        let lovID = await lov.findOrCreate({ where: { name: subject } });


        let accountActivity = await accountactivity.create({ subjectID: lovID[0].dataValues.id, action: message, userID: userID, userAgent: userAgent, IPAddress: ipAddress, browser: browser, operatingSystem: os });
        return 'Activity logged successfully';
    } catch (error) {

        throw error;

    }


}


async function fetchActivityLogs(req, res, next) {
    let err = {};
    try {
        let userID = req.query.userID;
        let offset = req.query.page;
        let recordLimit = req.query.limit;
        let accountActivites = await accountactivity.findAndCountAll({
            where: {
                userID: userID
            },
            limit: recordLimit,
            offset: offset,
        });
        return res.status(200).json({ error: false, message: '', data: accountActivites.dataValues });
    } catch (error) {
        err.statusCode = 400;
        err.message = 'An error occurred in fetching transaction details';
        err.stackTrace = error;
        next(err);
    }
}


async function fetchAdminActivityLogs(req, res, next) {
    let err = {};
    try {
        let offset = 0;
        let recordLimit = 10;

        if (req.query.page)
            offset = req.query.page * req.query.limit;
        if (req.query.limit)
            recordLimit = req.query.limit;


        let rawQueryCount = "select count(*) as totalRec from accountactivity as a inner join users as u on a.userID=u.id inner join lov as s on a.subjectID=s.id inner join roles as r on u.roleID=r.id where r.name NOT LIKE 'INVESTOR'";
        let rawTradeActivitiesCount = await sequelize.query(rawQueryCount, { type: QueryTypes.SELECT });
        let rawQuery = "select a.action,a.userAgent,a.IPAddress,a.createdAt,a.browser,a.operatingSystem,u.email,u.membershipNumber,s.name as subjectID from accountactivity as a inner join users as u on a.userID=u.id inner join lov as s on a.subjectID=s.id inner join roles as r on u.roleID=r.id where r.name NOT LIKE 'INVESTOR' order by createdAt desc limit " + offset + " ," + recordLimit;
        let rawTradeActivities = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });

        let jsonData = {
            count: rawTradeActivitiesCount[0].totalRec,
            data: rawTradeActivities
        };
        return res.status(200).json({ error: false, message: '', data: jsonData });
    } catch (error) {

        err.statusCode = 400;
        err.message = 'An error occurred in fetching admin activities';
        err.stackTrace = error;
        next(err);
    }
}



async function fetchUserActivityLogs(req, res, next, role) {
    let err = {};
    try {
        let offset = 0;
        let recordLimit = 10;

        if (req.query.page)
            offset = req.query.page * req.query.limit;
        if (req.query.limit)
            recordLimit = req.query.limit;

        let role = req.query.role;
        let rawQueryCount = "select count(*) as totalRec from accountactivity as a inner join users as u on a.userID=u.id inner join lov as s on a.subjectID=s.id inner join roles as r on u.roleID=r.id where r.name=:role";
        let rawTradeActivitiesCount = await sequelize.query(rawQueryCount, {replacements:{'role':role}, type: QueryTypes.SELECT });
        let rawQuery = "select a.action,a.userAgent,a.IPAddress,a.createdAt,a.browser,a.operatingSystem,u.email,u.membershipNumber,s.name as subjectID from accountactivity as a inner join users as u on a.userID=u.id inner join lov as s on a.subjectID=s.id inner join roles as r on u.roleID=r.id where r.name=:role order by createdAt desc limit :offset ,:recordLimit"
        let rawTradeActivities = await sequelize.query(rawQuery, {replacements:{'role':role,'offset':offset,'recordLimit':recordLimit}, type: QueryTypes.SELECT });

        let jsonData = {
            count: rawTradeActivitiesCount[0].totalRec,
            data: rawTradeActivities
        };
        return res.status(200).json({ error: false, message: '', data: jsonData });
    } catch (error) {

        err.statusCode = 400;
        err.message = 'An error occurred in fetching admin activities';
        err.stackTrace = error;
        next(err);
    }
}

async function getNameInitials(req, res, next) {
    let err = {};
    try {
        let profilePic = "";
        let userNameInitials = await users.findOne({ where: { id: req.decoded.id } });
        let portfolioBalance = await sequelize.query(`select count(*) as totalInvestments from portfoliobalance where portfoliobalance.userID =:id and portfoliobalance.balance > 0`, {replacements:{id:req.decoded.id}, type: QueryTypes.SELECT });
        
        if(userNameInitials && userNameInitials.profilePicture && userNameInitials.profilePicture != '') {
            let media = await generalSetting.getUserProfilePicture(userNameInitials.profilePicture, true);
            
            if(media) {
                profilePic = media.awsImage ? media.awsImage : '';
            }
        }
        var jsonData = {
            firstName: userNameInitials.dataValues.firstName,
            lastName: userNameInitials.dataValues.lastName,
            legalName: userNameInitials.dataValues.legalName,
            allowedModules: userNameInitials.dataValues.allowedModules,
            is_email_verified: userNameInitials.dataValues.is_email_verified,
            cookiesAcceptedBit:userNameInitials.dataValues.cookiesAcceptedBit,
            is_phonenumber_verified: userNameInitials.dataValues.is_phonenumber_verified,
            legalName: userNameInitials.legalName,
            membershipNumber: userNameInitials.membershipNumber,
            profilePicture: profilePic,
            walletAddress: userNameInitials.walletAddress,
            phoneNumber: userNameInitials.dataValues.phoneNumber,
            email: userNameInitials.dataValues.email,
            id: userNameInitials.dataValues.id,
            type: userNameInitials.dataValues.type,
            refferalCode: userNameInitials.dataValues.refferalCode,
            refferedBy: userNameInitials.dataValues.refferedBy,
            voucherExpireDate: userNameInitials.dataValues.voucherExpireDate,
            showIntro: userNameInitials.dataValues.showIntro,
            showReferralIntro: userNameInitials.dataValues.showReferralIntro,
            nickName: (userNameInitials && userNameInitials.dataValues && userNameInitials.dataValues.nickName ? userNameInitials.dataValues.nickName : null),
            totalInvestments: (portfolioBalance && portfolioBalance.length > 0 ? portfolioBalance[0].totalInvestments : 0),
            adminHomePage: (userNameInitials.dataValues.adminHomePage && userNameInitials.dataValues.adminHomePage!=null) ? userNameInitials.dataValues.adminHomePage:''
        };
        console.log("jsonData", jsonData);
        return res.status(200).json({ error: false, message: "User Information fetches successfully", data: jsonData });
    } catch (error) {
        console.log(error)
        err.statusCode = 400;
        err.message = 'An error occurred in fetching name initials';
        err.stackTrace = error;
        next(err);
    }

}

async function getUserIntroModules(req,res,next){
    let err = {};
    let id = req.decoded.id
    try { 

        let getAllModules = await sequelize.query('select * from modules', {type: QueryTypes.SELECT });
        let getUserModules = await sequelize.query('select * from walkthrough where userId = ? ', {replacements:[id], type: QueryTypes.SELECT });

       for(let i = 0 ; i < getAllModules.length ; i++){
        let check = getUserModules.filter(x=>x.moduleId == getAllModules[i].id)
        if(check.length == 0){
            console.log('getAllModules[i] : ',getAllModules[i])
            let insertUserModule = await sequelize.query('insert into walkthrough(userId,moduleId,introSkipCount,createdAt,updatedAt,popupBit)values(?,?,?,?,?,?)', {replacements:[id,getAllModules[i].id,0,new Date(),new Date(),1]});
        }
       }
        let query = `select m.id as moduleId,  m.moduleName, m.showOnModule,w.introSkipCount,w.popupBit from walkthrough as w
        INNER JOIN modules as m on m.id = w.moduleId 
         where w.userId = ?`
        let usermoduleInfo =  await sequelize.query(query, {replacements:[id], type: QueryTypes.SELECT });
        if(usermoduleInfo.length > 0){
            // console.log('usermoduleInfo: ',usermoduleInfo)
            return res.status(200).json({ error: false, message: "User intro modules fetches successfully", data: usermoduleInfo });
        }

    } catch (error) {
        console.log(error)
        err.statusCode = 400;
        err.message = 'An error occurred in fetching user intro modules';
        err.stackTrace = error;
        next(err);
    }
}
async function walkthroughChecks(req,res){
    let err = {};
     try{
         let userId =req.decoded.id
         let query="call sp_walkthrough_checks(?);"
         const result = await sequelize.query(query,{replacements:[userId], type: QueryTypes.SELECT });  
         if(result){
             var resultArray = Object.values(JSON.parse(JSON.stringify(result[0])))
             console.log('----------result : : ',resultArray[0])
             return res.status(200).json({ success:true,error: false, message: '',data:resultArray[0]})
            }

     }
     catch (error){
        err.statusCode = 400;
        err.message = 'Error';

     }

}
async function doneIntroCount(req,res,next){
    let err = {};
    try {
        let query = `select w.introSkipCount, m.id as moduleId from walkthrough as w INNER JOIN modules as m on m.id = w.moduleId where w.userId=? AND m.moduleName = ?`
        let checkUserCount =  await sequelize.query(query, {replacements:[req.decoded.id,req.body.moduleName], type: QueryTypes.SELECT });
        if(checkUserCount[0].introSkipCount <3){
        let query2 = `update walkthrough set introSkipCount =3 where userId= :id AND moduleId = :mid `
        let addUserCount =  await sequelize.query(query2,{replacements:{'id':req.decoded.id,'mid':checkUserCount[0].moduleId}});
        }else{
            return res.status(400).json({ error: true, message: "User module have already been done"});
        }
    }catch (error) {
    console.log(error)
    err.statusCode = 400;
    err.message = error;
    err.message = 'An error occurred in saving module done count.';
    err.stackTrace = error;
    next(err);
}
}
async function savePopupBit(req,res,next){
    let err = {};
    try {
        let query2 = `update walkthrough set popupBit =0 where userId= :id`
        let addUserCount =  await sequelize.query(query2,{replacements:{'id':req.decoded.id,}});
        if(addUserCount){
            return res.status(200).json({ error: false, message: "Popup bit Updated Successfully"});
        }
    }catch (error) {
    console.log(error)
    err.statusCode = 400;
    err.message = error;
    err.message = 'An error occurred in updating popup bit';
    err.stackTrace = error;
    next(err);
}
}
async function popupBit(req,res,next){
    let err = {};
    try {
        let query2 = `update walkthrough set popupBit =0 where userId= :id and moduleId=:moduleId`
        let addUserCount =  await sequelize.query(query2,{replacements:{'id':req.decoded.id,'moduleId':req.body.moduleId}});
        if(addUserCount){
            return res.status(200).json({ error: false, message: "Popup bit Updated Successfully"});
        }
    }catch (error) {
    console.log(error)
    err.statusCode = 400;
    err.message = error;
    err.message = 'An error occurred in updating popup bit';
    err.stackTrace = error;
    next(err);
}
}

async function saveIntroCount(req,res,next){
    let err = {};
    try {
        let query = `select w.introSkipCount, m.id as moduleId from walkthrough as w INNER JOIN modules as m on m.id = w.moduleId where w.userId=? AND m.moduleName = ?`
        let checkUserCount =  await sequelize.query(query, {replacements:[req.decoded.id,req.body.moduleName], type: QueryTypes.SELECT });
        if(checkUserCount.length > 0){
            if(checkUserCount[0].introSkipCount <3){
                let query2 = `update walkthrough set introSkipCount =(introSkipCount + 1) where userId=:id AND moduleId =:mid `
                let addUserCount =  await sequelize.query(query2,{replacements:{'id':req.decoded.id,'mid':checkUserCount[0].moduleId}});
                if(addUserCount){
                    return res.status(200).json({ error: false, message: "User module count added successfully"});
                }
            }else{
                return res.status(400).json({ error: true, message: "User module count have already been added"});
            }
        }

    } catch (error) {
    err.statusCode = 400;
    err.message = error;
    err.message = 'An error occurred in saving module count.';
    err.stackTrace = error;
    next(err);
}
}
async function roundSubscription(req,res,next){
    debugger;
    
    let err = {};
    try {
    let userID =  req.decoded.id;
    let body = req.body;
    let rawQueryCheck= `select  userID, roundID, propertyID from roundSubscription where userID =? and roundID=? and propertyID=?`;
    let rawQueryCheckExec = await sequelize.query(rawQueryCheck, {replacements:[userID,body.roundID,body.propertyID], type: QueryTypes.SELECT });
    if(rawQueryCheckExec.length==0){
        let rawQuery= `INSERT INTO roundSubscription (userID, roundID, propertyID, createdAt, updatedAt) VALUES (:id,:rid,:pid,CURDATE(),CURDATE())`;
        let rawQueryInsert = await sequelize.query(rawQuery, {replacements:{'id':userID,'rid':body.roundID,'pid':body.propertyID}, type: QueryTypes.INSERT });
    }
    return res.status(200).json({ error: false, message: 'Data Updated Successfully', data: '' });
    
    
    } catch (error) {

    err.statusCode = 400;
    err.message = error;
    // err.message = 'An error occurred in fetching transaction details';
    err.stackTrace = error;
    next(err);
}

}


async function transactionHistory(req, res, next) {
    

    let err = {};
    try {
        let offset = 0;
        let recordLimit = 100;
        let userID = req.query.userID;
        if (req.query.page)
            offset = req.query.page * req.query.limit;
        if (req.query.limit)
            recordLimit = req.query.limit;

        let countRec = await tradeactivity.count({
            where: {
                [Op.or]: [
                    { buyerID: userID },
                    { sellerID: userID },
                    { agentID: userID }
                ]
            }
        });
        // let rawQuery = "select t.id,b.membershipNumber as buyer,a.membershipNumber as seller,t.createdAt,t.paymentDate,t.areaPledged,t.sqftPrice,s.name as status,d.roundName as fundingRound,t.createdAt,t.updatedAt as lastUpdated from tradeactivity as t inner join users as b on t.buyerID =b.id inner join users as a on t.sellerID=a.id inner join statusenum as s on t.statusID=s.id inner join developmentrounds as d on t.roundID=d.id where t.buyerID=" + userID + " or t.sellerID=" + userID + " or t.agentID=" + userID + " limit " + offset + " ," + recordLimit;
        let rawQuery = "select t.id,b.membershipNumber as buyer,a.membershipNumber as seller,t.createdAt,t.paymentDate,t.areaPledged,t.sqftPrice,s.name as status,d.roundName as fundingRound,t.createdAt,t.updatedAt as lastUpdated from tradeactivity as t inner join users as b on t.buyerID =b.id inner join users as a on t.sellerID=a.id inner join statusenum as s on t.statusID=s.id inner join developmentrounds as d on t.roundID=d.id where (t.buyerID=" + userID + " or t.sellerID=" + userID + " or t.agentID=" + userID + ") AND t.isDemo is not true AND (NOT (t.statusID=11 OR t.internalStatus='discard'))  limit " + offset + " ," + recordLimit;
        let rawTradeActivities = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });


        let jsonData = {
            count: countRec,
            data: rawTradeActivities
        };
        return res.status(200).json({ error: false, message: '', data: jsonData });
    } catch (error) {
        console.log(error);
        err.statusCode = 400;
        err.message = 'An error occurred in fetching transaction details';
        err.stackTrace = error;
        next(err);
    }
}


async function fetchUserActivities(req, res, next) {
    let err = {};
    try {
        let offset = 0;
        let recordLimit = 10;

        if (req.query.page)
            offset = req.query.page * req.query.limit;
        if (req.query.limit)
            recordLimit = req.query.limit;

        let userID = req.query.userID;
        let rawQueryCount = "select count(*) as totalRec from accountactivity as a inner join users as u on a.userID=u.id inner join lov as s on a.subjectID=s.id where a.userID=:id";
        let rawTradeActivitiesCount = await sequelize.query(rawQueryCount, {replacements:{id:userID}, type: QueryTypes.SELECT });
        let rawQuery = "select a.action,a.userAgent,a.IPAddress,a.createdAt,a.browser,a.operatingSystem,u.email,u.membershipNumber,s.name as subjectID from accountactivity as a inner join users as u on a.userID=u.id inner join lov as s on a.subjectID=s.id where a.userID=? order by createdAt desc limit ? ,?" ;
        let rawTradeActivities = await sequelize.query(rawQuery, {replacements:[userID,offset,recordLimit], type: QueryTypes.SELECT });

        let jsonData = {
            count: rawTradeActivitiesCount[0].totalRec,
            data: rawTradeActivities
        };
        return res.status(200).json({ error: false, message: '', data: jsonData });
    } catch (error) {

        err.statusCode = 400;
        err.message = 'An error occurred in fetching admin activities';
        err.stackTrace = error;
        next(err);
    }

}


async function fetchLockTransactions(req, res, next) {
    let err = {};
    try {
        let offset = 0;
        let recordLimit = 1000;
        let jsonData = {
            count: 0,
            data: []
        };
        if (req.query.page)
            offset = req.query.page * req.query.limit;
        if (req.query.limit)
            recordLimit = req.query.limit;

        let isUserInvested = "select count(*) as rec from portfoliobalance where userID=?";
        let userCount = await sequelize.query(isUserInvested,{replacements: [req.decoded.id],type:QueryTypes.SELECT});
        if(userCount && userCount[0].rec)
        { 
            let investedProperties = await sequelize.query( "SELECT DISTINCT portfoliobalance.propertyID, property.`name`, property.propertySymbol FROM portfoliobalance INNER JOIN property ON portfoliobalance.propertyID=property.id WHERE portfoliobalance.userID=? AND portfoliobalance.balance > 0", { replacements: [req.decoded.id],type:QueryTypes.SELECT } );
            let propertyIds = [];
            if( investedProperties && Array.isArray(investedProperties) ) {
                propertyIds = investedProperties.map(item => item.propertyID);
            }
        let rawQueryCount = `select count(*) as totalRec from tradeactivity as t inner join users as b on t.buyerID = b.id inner join users as s on t.sellerID = s.id inner join statusenum as st on t.statusID=st.id where st.name='confirmed' AND ${propertyIds.length > 0 ? 't.propertyID IN ('+propertyIds.join(",")+')' : '1=1'}`;
        let rawTradeActivitiesCount = await sequelize.query(rawQueryCount, { type: QueryTypes.SELECT });
        // let rawQuery = `select p.propertySymbol as propertyName, b.walletAddress as buyer,b.tronAddress as buyerTronAddress, s.walletAddress as seller,s.tronAddress as sellerTronAddress, t.areaPledged as Area,st.name as txStatus,t.updatedAt as Time,t.blockchainReference,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.network") as blockchainNetwork,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.mainNetExplorerUrl") as mainNetExplorerUrl,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.testNetExplorerUrl") as testNetExplorerUrl,t.medium from tradeactivity as t inner join users as b on t.buyerID = b.id inner join users as s on t.sellerID = s.id inner join statusenum as st on t.statusID=st.id inner join property as p on t.propertyID=p.id  where st.name='confirmed'` + ` order by Time desc limit ` + offset + ` ,` + recordLimit;
        let rawQuery = `select p.propertySymbol as propertyName, b.walletAddress as buyer,b.tronAddress as buyerTronAddress, s.walletAddress as seller,s.tronAddress as sellerTronAddress, t.areaPledged as Area,st.name as txStatus,t.updatedAt as Time,t.medium, t.propertyID from tradeactivity as t inner join users as b on t.buyerID = b.id inner join users as s on t.sellerID = s.id inner join statusenum as st on t.statusID=st.id inner join property as p on t.propertyID=p.id  where st.name='confirmed' AND ${propertyIds.length > 0 ? 't.propertyID IN ('+propertyIds.join(",")+')' : '1=1'}` + ` order by Time desc limit ` + offset + ` ,` + recordLimit;

        let rawTradeActivities = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });
        // rawTradeActivities.forEach(element => {

        //     if(process.env.environment === 'prod')
        //         element.blockchainReference = element.mainNetExplorerUrl +element.blockchainReference;
        //     else 
        //         element.blockchainReference = element.testNetExplorerUrl +element.blockchainReference;
          

      //  });
        
        

     
            jsonData.count = rawTradeActivitiesCount[0].totalRec,
            jsonData.investedProperties = investedProperties,
            jsonData.data = rawTradeActivities
     
    }

        return res.status(200).json({ error: false, message: '', data: jsonData });


    } catch (error) {
       
        err.statusCode = 400;
        err.message = 'An error occurred in fetching transaction';
        err.stackTrace = error;
        next(err);
    }
}


async function userBalance(req, res, next) {

    let err = {};
    try {

        let userWalletAddress = await users.findOne({ where: { id: req.query.userID } });
        let userBalance = await blockchainModule.userBalance(userWalletAddress.dataValues.walletAddress);
        let areaConversion = await areaConversionUtils.convertToSqft(userBalance);
        return res.status(200).json({ error: false, message: '', data: areaConversion });

    } catch (error) {
        err.statusCode = 400;
        err.message = 'An error occurred in fetching transaction';
        err.stackTrace = error;
        next(err);
    }
}


async function blockchainEvents(req, res, next) {
    let err = {};
    let BlockchainEvents = [];
    try {

        let userWalletAddress = await users.findOne({ where: { id: req.query.userID } });
        let transactionEventsFrom = await blockchainModule.blockchainTransactionSend(userWalletAddress.dataValues.walletAddress);
        let transactionEventsTo = await blockchainModule.blockchainTransactionReceive(userWalletAddress.dataValues.walletAddress);
        let completeTransactionLogs = transactionEventsFrom.concat(transactionEventsTo);

        completeTransactionLogs.forEach(element => {

            BlockchainEvents.push({ txHash: element.transactionHash, blockNumber: element.blockNumber, from: element.returnValues.from, to: element.returnValues.to, areaUnits: element.returnValues.value / 10000 });
        });
        return res.status(200).json({ error: false, message: '', data: BlockchainEvents });

    } catch (error) {

        err.statusCode = 400;
        err.message = 'An error occurred in fetching transaction';
        err.stackTrace = error;
        next(err);
    }
}


async function userBlockchainTransaction(req,res,next){
    console.log("Req",req.query);

    let err= {};
    try {
        let rawQuery = `select p.propertySymbol as propertyName, b.walletAddress as buyer,b.tronAddress as buyerTronAddress, s.walletAddress as seller,s.tronAddress as sellerTronAddress, t.areaPledged as Area,st.name as txStatus,t.updatedAt as Time,t.blockchainReference,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.network") as blockchainNetwork,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.mainNetExplorerUrl") as mainNetExplorerUrl,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.testNetExplorerUrl") as testNetExplorerUrl,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.testNetExplorerUrl") as tronTestNetExplorerUrl,t.medium from tradeactivity as t inner join users as b on t.buyerID = b.id inner join users as s on t.sellerID = s.id inner join statusenum as st on t.statusID=st.id inner join property as p on t.propertyID=p.id  where st.name='confirmed' and (t.buyerID=`+req.query.userID +` or t.sellerID=`+req.query.userID+`);`;
        let rawTradeActivities = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });
        return res.status(200).json({ error: false, message: '', data: rawTradeActivities });
    } catch(error){
        console.log(error);
        err.statusCode = 400;
        err.message = 'An error occurred in fetching transaction';
        err.stackTrace = error;
        next(err);
        
    }
}


async function fetchSalesAgent(req, res, next) {
    let err = {};
    try {

        let rawQuery = "select u.firstName,u.lastName,u.membershipNumber from users as u inner join roles as r on u.roleID=r.id inner join rolePermissions as rp on r.id = rp.roleID inner join permissions as p on rp.permissionID=p.id where p.name = 'IS_USER_SALES_AGENT';";
        let SalesAgent = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });
        return res.status(200).json({ error: false, message: '', data: SalesAgent });
    } catch (error) {
        err.statusCode = 400;
        err.message = 'Error occurred in fetching sales agent';
    }
}


async function testStatusCode(req, res, next) {
    let statusCode = req.query.code;
    let err = {};
    err.statusCode = statusCode;
    err.message = "Error";
    next(err);
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function getUserArea(req,res,next){//changess
    let err = {};
    try {
        const rawQuery = `select p.id as propertyId,p.name,p.description,p.totalSqft,p.propertySymbol,p.propertyLogo,ua.*,pb.balance from property p left join userArea ua on p.id = ua.propertyID left join portfoliobalance pb on pb.propertyID =ua.propertyID where ua.userID=? && pb.userID=?`;
        const result = await sequelize.query(rawQuery, {replacements:[req.params.id?req.params.id:0,req.params.id?req.params.id:0], type: QueryTypes.SELECT });
        const rawQuery1 = `select * from property`;
        const result1 = await sequelize.query(rawQuery1, { type: QueryTypes.SELECT });

        return res.status(200).json({ error: false, message: '', data:{userArea:result,properties:result1}});
    } catch (error) {
        err.statusCode = 400;
        err.message = 'Error occurred in fetching sales agent';
    }
}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function addUserArea(req,res,next){
    let err = {};
    try {
        const rawQuery = `INSERT INTO userArea(userId,propertyId,area)values(?,?,?)`;
        const result = await sequelize.query(rawQuery, {replacements:[req.body.userId,req.body.property,req.body.area], type: QueryTypes.INSERT });
        return res.status(200).json({ success:true,error: false, message: '', data:result});
    } catch (error) {
        err.statusCode = 400;
        err.message = 'Error occurred in fetching sales agent';
    }
}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function deleteUserArea(req,res,next){
    let err = {};
    try {
        const rawQuery = `delete from userArea where id = ?`;
        const result = await sequelize.query(rawQuery, {replacements:[req.params.id], type: QueryTypes.DELETE });
        return res.status(200).json({ success:true,error: false, message: '', data:result});
    } catch (error) {
        err.statusCode = 400;
        err.message = 'Error occurred in fetching sales agent';
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function updateUserArea(req,res,next){
    let err = {};
    try {
       
       // let rawQuery = `update userArea set area = ${req.body.area} where id = ${req.body.id}`;
       let rawQuery = "call sp_admin_update_unlock_area(?,?,?,?);";
        // if(req.body.property>0&&req.body.userId>0){
        //     rawQuery = `update userArea set area = area + ${req.body.area} where id = ${req.body.id} or (userId = ${req.body.userId} and propertyID = ${req.body.property})`
        // }
        const result = await sequelize.query(rawQuery, {replacements:[req.body.area,req.body.id,req.body.userId,req.body.property]});
        return res.status(200).json({ success:true,error: false, message: '', data:result});
    } catch (error) {
        err.statusCode = 400;
        err.message = 'Error occurred in updating area unlock';
        res.status(200).json({success:false,error:true,message:'Some error occured',data:error});
    }
}

async function updateCookiesBit(req, res, next) {

    try {
      let userID , bit , sql;
      
      if (!(req.query&&req.query.id&&req.query.bit)) {
        return res.status(400).json("Please provide userID and cookiesBit");
      }
      userID = parseInt(req.query.id);
      bit =  parseInt( req.query.bit)
      sql = `UPDATE users SET cookiesAcceptedBit = ? WHERE id = ?`;
      const response = await sequelize.query(sql,{replacements:[bit,userID]});  
      if(response){
          return res.status(200).json({ success:true,error: false, message: 'cookies bit updated'})
      }

    else {
        res.status(400).send('Error updating')
    }
    } catch (error) {
      res.status(400).send(error.message);
    }
  }


module.exports.checkPhoneNumber = checkPhoneNumber;
module.exports.getPaymentNumber = getPaymentNumber;
module.exports.checkEmail = checkEmail;
module.exports.activityLogs = activityLogs;
module.exports.getNameInitials = getNameInitials;
module.exports.transactionHistory = transactionHistory;
module.exports.fetchAdminActivityLogs = fetchAdminActivityLogs;
module.exports.fetchUserActivities = fetchUserActivities;
module.exports.fetchLockTransactions = fetchLockTransactions;
module.exports.userBalance = userBalance;
module.exports.blockchainEvents = blockchainEvents;
module.exports.fetchSalesAgent = fetchSalesAgent;
module.exports.testStatusCode = testStatusCode;
module.exports.roundSubscription = roundSubscription;
module.exports.getUserArea = getUserArea;
module.exports.addUserArea = addUserArea;
module.exports.deleteUserArea = deleteUserArea;
module.exports.updateUserArea = updateUserArea;
module.exports.getUserIntroModules = getUserIntroModules;
module.exports.saveIntroCount = saveIntroCount;
module.exports.doneIntroCount = doneIntroCount;
module.exports.updateCookiesBit = updateCookiesBit;
module.exports.userBlockchainTransaction = userBlockchainTransaction;
module.exports.savePopupBit = savePopupBit;
module.exports.popupBit = popupBit;
module.exports.walkthroughChecks =walkthroughChecks;
