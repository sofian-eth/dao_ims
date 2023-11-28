const core = require('core');
const db =  core.db;
const responseObject = core.responseObject;
const utility = require('../../utils/utils');
const emailUtils = require('../../utils/email');
const receiptGeneration = require('../../services/shared/receipt');
const { logActivity } = require('../../services/shared/activity-logger');
const ActivityEvent = require('../../resources/enum-ActivityLog-event');
const moment = require('moment');
const getProperties = async function (userID) {
    let resp = new responseObject();
     try {
        let result = await db.sequelize.query("call  sp_rd_get_rentals_and_credits_listings(?)",{replacements:[userID]});
        console.log(result)
        resp.setSuccess("listings fetched");
        resp.data = result;
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "Properties_NOT_FETCHED");
    }
    return resp;
}

const getRentalCreditHeaderStats = async function (userID) {
    let resp = new responseObject();
     try {
        let result = await db.sequelize.query("call  sp_rd_get_rentals_and_credits_header_stats(?)",{replacements:[userID]});
        console.log(result)
        resp.setSuccess("stats fetched");
        resp.data = result;
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "STATS_NOT_FETCHED");
    }
    return resp;
}
const getRentalHeaderStatsOfProperty = async function (userID,propertyID) {
    let resp = new responseObject();
     try {
        let result = await db.sequelize.query("call  sp_rd_get_my_rental_header_stats_by_project_v2(?)",{replacements:[[userID,propertyID]]});
        console.log(result)
        resp.setSuccess("stats fetched");
        resp.data = result;
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "STATS_NOT_FETCHED");
    }
    return resp;
}

const getRentalListingByProperty = async function (userID,propertyID,status,startDate,endDate) {
    let resp = new responseObject();
     try {
        let result = await db.sequelize.query("call  sp_rd_get_rental_listings_by_project_v2(?)",{replacements:[[status,propertyID,userID,startDate,endDate]]});
        let upcomingPayoutResult = await db.sequelize.query(`SELECT 
            portfoliobalance.balance,
            propertyRentPayouts.rentPayoutMonth,
            propertyRentPayouts.rentPayoutYear,
            property.rentDisbursementDuration,
            property.rentalDisbursementDay,
            1+IFNULL(propertyRentPayouts.payoutNo,0) as payoutNumber,
            PROPERTY_STATS(property.id, 'CURRENT_RENT_PER_SQFT') as rent,
            PROPERTY_STATS(property.id, 'OCCUPANCY_PERCENTAGE') as occupancy
        FROM propertyRentPayouts
        left join portfoliobalance on portfoliobalance.propertyID=propertyRentPayouts.propertyID and portfoliobalance.userID=?
        inner join property on property.id=propertyRentPayouts.propertyID and property.isDAORental=1
        where propertyRentPayouts.propertyID=? ORDER BY propertyRentPayouts.payoutNo desc limit 1;`, {replacements:[userID, propertyID]})
        console.log(result)
        resp.setSuccess("listings fetched");
        resp.data = {
            data: result,
            upcoming: ((Array.isArray(upcomingPayoutResult) && upcomingPayoutResult.length>0) ? upcomingPayoutResult[0][0] : null)
        };
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "LISTINGS_NOT_FETCHED");
    }
    return resp;
}

const getMyRentalProperties = async function (userID) {
    let resp = new responseObject();
     try {
        let result = await db.sequelize.query("call  sp_rd_get_rental_properties(?)",{replacements:[[userID]]});
        console.log(result)
        resp.setSuccess("properties fetched");
        resp.data = result;
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "PROPERTIES_NOT_FETCHED");
    }
    return resp;
}

const sendRentalDisbursementReminder = async function (params) {
    let resp = new responseObject();
     try {
        let userInfo = await db.sequelize.query("call  sp_rd_get_userInfo_for_reminder(?)",{replacements:[[params.userID, params.payoutID]]});
        await db.sequelize.query("update propertyUserRentDisbursements set isReminded=1 where userID=? and rentPayoutID=?",{replacements:[params.userID, params.payoutID]});
        if(userInfo && userInfo[0]){
            userInfo=userInfo[0]
            let result = emailUtils.sendRentalDisbursementReminder(userInfo);
            resp.setSuccess("REMINDER_SENT");
            resp.data = result;
        }
        
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "REMINDER_NOT_SENT");
    }
    return resp;
}

const generateActivity = async function (req) {
    let resp = new responseObject();
    let number = req.body.payoutNo;
    number = number + (["st", "nd", "rd"][((number + 90) % 100 - 10) % 10 - 1] || "th");

    try {
     let result = await logActivity(
            {
                    logName: "Rental",
                    description: `of ${number} payout in`,
                    subjectType: "users",
                    event: ActivityEvent.DOWNLOADEDRECEIPT,
                    causerID: req.decoded.id,
                    subjectID: req.decoded.id,
                    causerType: "users",
                    propertyID : req.body.propertyID,
                    properties: {
                        attributes: null,
                        old: null
                    },
                    source: null,
                    metadata:null
                    }
         , req)
        return result;
    } catch (e) {
          console.log(e);
        resp.setError(en.toString(), "ACTIVITY_NOT_GENERATED");
    }
}
const downloadRentalReceipt = async function (params) {
    let resp = new responseObject();
     try {
        let userData=await db.sequelize.query('call sp_admin_rd_get_holderInfo_for_rentalReceipt(?)',{replacements:[[params.userID,params.payoutID]]})
        userData=userData[0];
        userData.bankInfo.bankLogo ? userData.bankInfo.bankLogo=userData.bankInfo.bankLogo.split('/')[4]:null;
        
        userData.rentalAmountBreakDown.taxDeductionPercentage = ( (userData.rentalAmountBreakDown.taxDeduction*100)/(userData.rentalAmountBreakDown.rentalAmount) ).toFixed()
        userData.rentalAmountBreakDown.rentToPay = Math.round(userData.rentalAmountBreakDown.rentalAmount - userData.rentalAmountBreakDown.taxDeduction)
        userData.disbursementDate=moment(userData.invoiceGeneratedAt).format('MMM D,YYYY')
        userData.payoutNumber = utility.ordinal(userData.payoutNumber);
        userData.rentalAmount ?  userData.rentalAmount = utility.thousandseparator( userData.rentalAmount) : 0;
        userData.rentalDetails.currentRate ?  userData.rentalDetails.currentRate  = utility.thousandseparator( userData.rentalDetails.currentRate ) : 0;
        userData.rentalDetails.totalAmount ?  userData.rentalDetails.totalAmount  = utility.thousandseparator( userData.rentalDetails.totalAmount ) : 0;
        userData.rentalAmountBreakDown.rentalAmount ?  userData.rentalAmountBreakDown.rentalAmount  = utility.thousandseparator( userData.rentalAmountBreakDown.rentalAmount ) : 0;
        userData.rentalAmountBreakDown.taxDeduction ?  userData.rentalAmountBreakDown.taxDeduction  = utility.thousandseparator( userData.rentalAmountBreakDown.taxDeduction ) : 0;
        userData.rentalAmountBreakDown.rentToPay ?  userData.rentalAmountBreakDown.rentToPay  = utility.thousandseparator( userData.rentalAmountBreakDown.rentToPay ) : 0;
        
        userData.startDuration=moment(userData.startDuration).format('MMM DD');
        userData.endDuration=moment(userData.endDuration).format('MMM DD, YYYY');
        userData.generatedOn=moment(userData.generatedOn).format('MMM DD, YYYY');
        userData.memeberSince=moment(userData.memeberSince).format('MMM, YYYY');
        const reciept = await receiptGeneration.invoiceReceipt('rental_paid_receipt_new', userData) 
        await  db.sequelize.query('UPDATE propertyUserRentDisbursements SET propertyUserRentDisbursements.paidReceiptID=? WHERE userID=? AND rentPayoutID=? ',
                                    {replacements:[reciept.mediaId,params.userID,params.payoutID]})     
        console.log(reciept)
        resp.setSuccess("INVOICE_GENERATED");
         resp.data = {
             receiptId : reciept.mediaId,
             receipt: reciept.url,
             name: reciept.originalFileName,
             relativePath : reciept.relativePath
         };
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "INVOICE_NOT_GENERATED");
    }
    return resp;
}

const generateRentalPropertyPayoutReport = async function (params) {
    let resp = new responseObject();
     try {
        let result = await db.sequelize.query("call  sp_rd_get_receipt_data_by_property(?)",
                                            {replacements:[[params.propertyID,params.userID,params.startDate,params.endDate]]});
        console.log(result)
        resp.setSuccess("payouts fetched");
        resp.data = result;
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "PAYOUTS_NOT_FETCHED");
    }
    return resp;
}

const generateRentalPropertiesDataReport = async function (params) {
    let resp = new responseObject();
     try {
        let result = await db.sequelize.query("call  sp_rd_get_receipt_properties_data(?)",
                                            {replacements:[[params.propertyID,params.userID,params.startDate,params.endDate]]});
        console.log(result)
        resp.setSuccess("payouts fetched");
        resp.data = result;
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "PAYOUTS_NOT_FETCHED");
    }
    return resp;
}


const downloadGeneratedReport = async function (params) {
    let resp = new responseObject();
     try {
        if(params.propertyPayout!='false'){
            let result = await db.sequelize.query("call  sp_rd_get_receipt_data_by_property(?)",
                                            {replacements:[[params.propertyID,params.userID,params.startDate,params.endDate]]});
            console.log(result)
            result=result[0];
            result.startDate=moment(params.startDate).format('MMM DD,YYYY')
            result.endDate=moment(params.endDate).format('MMM DD,YYYY');
            if(result.rentalSummary && result.rentalSummary.length>0){
                result.totalAmount=0;
                result.totalTax=0;
                result.rentalSummary.forEach(x=>{
                    result.totalAmount=result.totalAmount+x.amount;
                    result.totalTax=result.totalTax+x.tax;
                    x.amount= utility.thousandseparator(x.amount);
                    x.rentalRate= utility.thousandseparator(x.rentalRate);
                    x.tax= utility.thousandseparator(x.tax);
                    x.area= utility.thousandseparator(x.area);
                    x.payoutNumber= utility.ordinal(x.payoutNumber);
                    x.payoutDate = moment(params.payoutDate).format('MMM DD,YYYY');
                    x.payoutCycle==3? x.payoutCycle='Quarterly':x.payoutCycle='Monthly';
                   
                })
                result.totalAmount= utility.thousandseparator(result.totalAmount);
                result.totalTax= utility.thousandseparator(result.totalTax);

                result.todayDate=moment().format('MMM DD,YYYY')
            }
            result.holderInfo.memberSince = moment(result.holderInfo.memberSince).format('MMM, YYYY')
            const reciept = await receiptGeneration.rentalReport('rental_property_payouts_report_new', result) 
            resp.setSuccess("payouts fetched");
            resp.data = reciept.url;
        }
        else{
            let result = await db.sequelize.query("call  sp_rd_get_receipt_properties_data(?)",
                                            {replacements:[[params.propertyID,params.userID,params.startDate,params.endDate]]});
            console.log(result)
            result=result[0];
            result.startDate=moment(params.startDate).format('MMM DD,YYYY')
            result.endDate=moment(params.endDate).format('MMM DD,YYYY');
            if(result.propertyListing && result.propertyListing.length>0){
                result.totalAmount=0;
                result.totalTax=0;
                result.propertyListing.forEach(x=>{
                    result.totalAmount=result.totalAmount+x.amount.rental;
                    result.totalTax=result.totalTax+x.amount.tax;
                    x.amount.tax= utility.thousandseparator(x.amount.tax);
                    x.amount.rental= utility.thousandseparator(x.amount.rental);
                    x.area = utility.thousandseparator(x.area);
                   
                })
                result.totalAmount= utility.thousandseparator(result.totalAmount);
                result.totalTax= utility.thousandseparator(result.totalTax);

                result.todayDate=moment().format('MMM DD,YYYY')
            }
            result.holderInfo.memberSince = moment(result.holderInfo.memberSince).format('MMM, YYYY')
            const reciept = await receiptGeneration.rentalReport('rental_properties_report_new', result) 
            resp.setSuccess("payouts fetched");
            resp.data = reciept.url;
        }
        
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "PAYOUTS_NOT_FETCHED");
    }
    return resp;
}


const markDisbursementAsRecieved = async function (params) {
    let resp = new responseObject();
     try {
        let result = await db.sequelize.query("call  sp_rd_mark_disbursement_as_recieved(?)",
                                            {replacements:[[params.userID,params.disbursementID]]});
        console.log(result)
        resp.setSuccess("payouts acknowledged");
        resp.data = result;
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "PAYOUTS_NOT_FETCHED");
    }
    return resp;
}

const requestSkippedPayouts = async function (disbursementIDs,userID,req) {
    let resp = new responseObject();
    let query = `call sp_rd_get_user_liability_amount(?)`;

    let result = await db.sequelize.query(query, { replacements: [[disbursementIDs]]});
    
    const transaction = await db.sequelize.transaction();
     try {
        if(disbursementIDs){
            for(let i=0;i<disbursementIDs.length;i++){
                 await db.sequelize.query("call  sp_rd_request_skipped_payout(?)",
                {replacements:[[disbursementIDs[i],userID]]},
                transaction);
            }
            await transaction.commit();
            resp.setSuccess("payouts requested");
            resp.data = { message: "payouts requested" };
            if (result && result.length > 0) {
            result = result[0];
        logActivity(
        {
                logName: "Rental",
                description: `for a skipped rental amount of amount in PKR ${result.rentalAmount}`,
                subjectType: "users",
                event: ActivityEvent.REQUESTEDWITHDRAWAL,
                causerID: req.decoded.id,
                subjectID: req.decoded.id,
                causerType: "users",
                propertyID : result.propertyID,
                properties: {
                    attributes: null,
                    old: null
                },
                source: null,
                metadata:null
                }
                ,req)
        }
        }
        
    } catch (ex) {
        await transaction.rollback();
        resp.setError(ex.toString(), "FAILED_TO_REQUEST_PAYOUTS");
    }
    return resp;
}

const setDefaultBankForPayout = async function (bankID,userID,propertyID) {
    let resp = new responseObject();
     try {
        let result = await db.sequelize.query("call  sp_rd_set_default_bank_for_payout(?)",
            { replacements: [[userID, propertyID, bankID]] });
         
         let sql2 = `update propertyUserRentDisbursements set isBankingError = 0 where userID = ${userID} and isBankingError = 1`;
       let result2 = await db.sequelize.query(sql2, {
                    replacements: []
                })
         
        resp.setSuccess("BANK_SET_AS_DEFAULT");
        resp.data = result;
    } catch (ex) {
        resp.setError(ex.toString(), "FAILED_TO_SET_BANK_AS_DEFAULT");
    }
    return resp;
}

const skipPayout = async function (disbursementID,userID,req) {
    let resp = new responseObject();
     try {
        let payout = await db.sequelize.query("call  sp_rd_payout_info(?)",
            { replacements: [[disbursementID]] });
         
        let result = await db.sequelize.query("call  sp_rd_skip_payout(?)",
            { replacements: [[userID, disbursementID]] });
         
         if(payout && payout.length > 0) {
             payout = payout[0];
             payout.payoutNo = payout.payoutNo + (["st", "nd", "rd"][((payout.payoutNo + 90) % 100 - 10) % 10 - 1] || "th");
             logActivity(
                {
                        logName: "Rental",
                        description: `the ${payout.payoutNo} payout in`,
                        subjectType: "users",
                        event: ActivityEvent.SKIPPED,
                        causerID: req.decoded.id,
                        subjectID: req.decoded.id,
                        causerType: "users",
                        propertyID : payout.propertyID,
                        properties: {
                            attributes: null,
                            old: null
                        },
                        source: null,
                        metadata:null
                        }
                        ,req)
         }
         
        resp.setSuccess("PAYOUT_SKIPPED");
        resp.data = result;
    } catch (ex) {
        resp.setError(ex.toString(), "FAILED_TO_SKIP_PAYOUT");
    }
    return resp;
}

const getRentalActivityLog = async function (userID, req) {
    let offset = req.query.limit * (req.query.page - 1);
    let resp = new responseObject();
    try {
        let result = await db.sequelize.query("call  sp_rd_get_activity(?)",
        {replacements:[[userID, req.query.propertyID,offset,req.query.limit]]});
        resp.setSuccess("ACTIVITIES_FETCHED");
        resp.data = result;
    } catch (ex) {
        resp.setError(ex.toString(), "ACTIVITIES_NOT_FETCHED");
    }
    return resp;
}

const downloadLiabilityReport = async function (userID,propertyID) {
    let resp = new responseObject();
    try {
        let userData = await db.sequelize.query("call  sp_rd_get_user_liability_receipt_data(?)",
        {replacements:[[userID,propertyID]]});
        userData=userData[0];
        userData.userInfo ? userData.userInfo = JSON.parse(userData.userInfo) : userData.userInfo=userData.userInfo;
        userData.liabilityInfo ? userData.liabilityInfo = JSON.parse(userData.liabilityInfo) : userData.liabilityInfo=userData.liabilityInfo;
        userData.propertyInfo ? userData.propertyInfo = JSON.parse(userData.propertyInfo) : userData.propertyInfo=userData.propertyInfo;
        userData.totalAmountOwed = userData.liabilityInfo.reduce((sum, obj) => sum + (obj.amount || 0), 0);
        userData.totalAmountOwed = utility.thousandseparator( userData.totalAmountOwed);
        userData.userInfo.memberSince =  moment(userData.userInfo.memberSince).format('MMM,YYYY');
        userData.liabilityInfo.forEach((x)=>{
            x.payoutNumber = utility.ordinal(x.payoutNumber);
            x.amount = utility.thousandseparator( x.amount);
            x.payoutDate = moment(x.payoutDate).format('MMM DD,YYYY');
        })
        const reciept = await receiptGeneration.invoiceReceipt('rental_liability_report', userData) 
        resp.setSuccess("REPORT_GENERATED");
        resp.data = {
            receipt: reciept.url,
            name : reciept.originalFileName
        };
    } catch (ex) {
        resp.setError(ex.toString(), "REPORT_NOT_GENERATED");
    }
    return resp;
}

module.exports={
    getProperties,
    getRentalCreditHeaderStats,
    getRentalHeaderStatsOfProperty,
    getRentalListingByProperty,
    sendRentalDisbursementReminder,
    downloadRentalReceipt,
    getMyRentalProperties,
    generateRentalPropertyPayoutReport,
    generateRentalPropertiesDataReport,
    downloadGeneratedReport,
    markDisbursementAsRecieved,
    requestSkippedPayouts,
    setDefaultBankForPayout,
    skipPayout,
    getRentalActivityLog,
    generateActivity,
    downloadLiabilityReport
}
