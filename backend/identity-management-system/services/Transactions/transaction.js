// all function realated to transaction


const { Op, QueryTypes } = require("sequelize");
const bcryptjs = require('bcryptjs');
const walletUtils = require('../../utility/wallet-address');
const membershipUtils = require('../../utility/membership-number');

const { validateAdminSignup, validateAdminRemove } = require('../../utility/validators');
const sharedService = require('../shared/common');

const sequelize = require('../../utility/dbConnection');

const { raw } = require('body-parser');

async function transactionListing(req, res, next) {
    let err = {};
    let rawQuery;
    let transactionType;
    let pageSize = parseInt( req.query.pageSize || 10); 
    let pageNo = parseInt(req.query.pageNo || 0);
    let offset = parseInt(pageNo * pageSize);
    let search = req.query.search || '';
    let whereClause='';
    try {
        let enums = {1:'locked', 2:'pending',3:'discard'}
        if((search.trim())!=''){
            search = '%'+search+'%';
            whereClause="(t.id LIKE'"+search+"' OR t.paymentDate LIKE'"+search+"' OR t.sqftPrice LIKE'"+search+"' OR t.totalPrice LIKE'"+search+"' OR t.areaPledged LIKE'"+search+"' OR t.blockchainReference LIKE'"+search+"' OR t.paymentDate LIKE'"+search+"' OR st.name LIKE'"+search+"' OR b.email LIKE'"+search+"' OR b.phoneNumber LIKE'"+search+"' OR a.membershipNumber LIKE'"+search+"') AND"
        }
        transactionType = enums[req.query.transactionType]
        // rawQuery = "select t.id as ticketNo, t.paymentDate,t.sqftPrice, t.totalPrice, t.areaPledged,t.blockchainReference, st.name as status, b.email, b.phoneNumber, a.membershipNumber as agentMemberShipNumber from tradeactivity as t inner join status as st on t.status=st.id inner join users as b on t.buyerID=b.id inner join users as s on t.sellerID=s.id left join users as a on t.agentID=a.id  where st.name ='"+transactionType + "'LIMIT "+pageSize+" OFFSET "+offset+"; "
        rawQuery = "select t.id as ticketNo, t.paymentDate,t.sqftPrice, t.totalPrice, t.areaPledged,t.blockchainReference, st.name as status, b.email, b.phoneNumber, a.membershipNumber as agentMemberShipNumber from tradeactivity as t inner join statusenum as st on t.status=st.id inner join users as b on t.buyerID=b.id inner join users as s on t.sellerID=s.id left join users as a on t.agentID=a.id  where "+whereClause+" st.name ='"+transactionType + "' LIMIT "+pageSize+" OFFSET "+offset+"; "
        let QueryOutput = await sequelize.query(rawQuery,{raw:true,type: QueryTypes.SELECT})
   
        let rawCount = "select count(*) as totalRecords, t.id as ticketNo, t.paymentDate,t.sqftPrice, t.totalPrice, t.areaPledged,t.blockchainReference, st.name as status, b.email, b.phoneNumber, a.membershipNumber as agentMemberShipNumber from tradeactivity as t inner join statusenum as st on t.status=st.id inner join users as b on t.buyerID=b.id inner join users as s on t.sellerID=s.id left join users as a on t.agentID=a.id where st.name = '"+transactionType+"';"
        let QueryCount = await sequelize.query(rawCount,{raw:true,type: QueryTypes.SELECT})    
 
        if(QueryOutput){
            if(transactionType == 'locked' || transactionType == 'discard'){
            QueryOutput =  QueryOutput.reverse();
            }
        return res.status(200).json({ error: false, message: "", data:{
        totalRecords:QueryCount[0].totalRecords || 0,
        transactions:QueryOutput
        }});
        }
    } catch (error) {
     
        err.statusCode = 400;
        err.message = "Error occurred in fetching transactions";
        err.stackTrace = error;
        next(err);
    }

}

module.exports.transactionListing = transactionListing;

