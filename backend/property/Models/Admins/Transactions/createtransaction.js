const db = require('../../db');
const knex = db.knex;





const createtx = function (formdata) {

    var totalcost = parseInt(formdata.areaunits) * formdata.currentprice + formdata.totaltaxes;
    var createdDate = new Date();

    var sellerid;
    var buyerid;
    var buyeraddress;
    var queue;
    var date = new Date(formdata.paymentdeadline);
    var responseobject = {};
    var paymentID = 1;
    var statusID;


    return knex.transaction(function (tx) {
        return tx('statusenum').where({ name: 'pending' }).select('id')
            .then(function (result) {
                statusID = result[0].id;
                return tx('users').where({ email: formdata.selleremail }).select('id');
            })
            .then(function (result) {
                sellerid = result[0].id;
                return tx('users').where({ email: formdata.buyeremail }).select('id', 'membershipNumber', 'firstName', 'lastName');
            })
            .then(function (result) {
                buyerid = result[0].id;
                responseobject.membershipid = result[0].membershipNumber;

                return tx('users').where({ id: buyerid }).select('legalName', 'billingAddress');

            })
            .then(function (result) {
                buyeraddress = result[0].billingAddress;
                responseobject.investorname = result[0].legalName;
                return tx('tradeactivity').insert({ sellerID: sellerid, buyerID: buyerid, blockchainreference: '', statusID: statusID, paymentDate: date, billingAddress: buyeraddress, areaPledged: formdata.areaunits, totalPrice: totalcost, propertyID: 1, sqftPrice: formdata.currentprice, paymentMode: paymentID, queueNumber: '', operations: formdata.operations, createdAt: createdDate, updatedAt: createdDate, roundID: formdata.devround }, 'id')
            })
            .then(function (result) {
                queue = result[0];
                return tx('tradeactivity').where({ id: queue }).update({ queueNumber: queue });
            })
            .then(function (result) {
                return tx('tradeactivity').where({ id: queue }).select('*')
            })
            .then(function (result) {
                responseobject = result[0];
                return responseobject;
            })
            .catch(function (error) {
                throw error;
            })
    })



}



const createTX = function (formdata) {

    var totalcost = formdata.areaunits * formdata.currentprice + formdata.totaltaxes;
    var createdDate = new Date();

    var sellerid;
    var buyerid;
    var buyeraddress;
    var queue;
    var date = new Date(formdata.paymentdeadline);
    var responseobject = {};
    var paymentID = 1;
    var statusID;


    return knex.transaction(function (tx) {
        return tx('statusenum').where({ name: 'pending' }).select('id')
            .then(function (result) {
                statusID = result[0].id;
                return tx('tradeactivity').insert({ sellerID: formdata.sellerID, buyerID: formdata.buyerID, blockchainreference: '', statusID: statusID, paymentDate: date, billingAddress: buyeraddress, areaPledged: formdata.areaunits, totalPrice: totalcost, propertyID: 1, sqftPrice: formdata.currentprice, paymentMode: paymentID, queueNumber: '', operations: formdata.operations, createdAt: createdDate, updatedAt: createdDate, roundID: formdata.devround }, 'id')
            })
            .then(function (result) {
                queue = result[0];
                return tx('tradeactivity').where({ id: queue }).update({ queueNumber: queue });
            })
            .then(function (result) {
                return tx('tradeactivity').where({ id: queue }).select('*')
            })
            .then(function (result) {
                responseobject = result[0];
                return responseobject;
            })
            .catch(function (error) {
                throw error;
            })
    })



}


const updateReceipt =async function(queueNumber){


    let query="select ta.paymentReceivableDate as paymentReceivableDate, ta.buyerID as userId, prop.id as projectID, prop.name as projectName, roundInfo.roundName as roundName, roundInfo.pricePerSqft as roundPrice, ta.totalPrice as totalPrice, ta.paymentDate as dueDate, ta.areaPledged as areaPledged, ta.paymentReceivableDate as paymentRecievedDate, ta.internalStatus as currStatus, ta.agentID as agentID , saleAgent.legalName as saleAgentLegalName, saleAgent.phoneNumber as saleAgentPhoneNumber, saleAgent.email as saleAgentEmail from tradeactivity as ta join property as prop on prop.id=ta.propertyID join developmentrounds as roundInfo on roundInfo.id=ta.roundID left join users as saleAgent on ta.agentID=saleAgent.id where queueNumber="+queueNumber;
    return knex
    .raw(query)
    .then((x) => {
        // console.log('x[0] : ',x[0])
        x = Object.values(JSON.parse(JSON.stringify(x[0])));
        debugger
      return x[0] ;
    })
    .catch((x) => {
        console.log(x);
      throw x;
    });

}

const updatetx = function (request) {
    var updatedDate = new Date();
   


  return knex('tradeactivity')
         .where({queueNumber: request.queuenumber})
         .select('sqftPrice')
         .then(function(result){
             let sqftPrice= result[0].sqftPrice;
             let totalCost = (request.areaunits *sqftPrice)+ request.totaltaxes;
             return knex('tradeactivity').where({queueNumber: request.queuenumber}).update({ paymentMode: request.paymentmode, paymentDate: request.paymentdeadline, areaPledged: request.areaunits, totalPrice: totalCost, updatedAt: updatedDate });
         }) 
         .then(function(result){
             
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}


const discardtx = function (queuenumber) {
    debugger;
    var updatedDate = new Date();
    return knex.transaction(async function (tx) {
        try {
            const tradeActivity = await tx('tradeactivity').where({ queueNumber: queuenumber }).select('id', 'medium');
            if( tradeActivity.length > 0 ) {
                const medium = tradeActivity[0].medium; //'DEMARCATION';
                if( medium==='DEMARCATION' ) {
                    const demarcatedUserAssetTransaction = await tx('demarcatedUserAssetTransactions').where({ tradeActivityID: tradeActivity[0].id }).select('userAssetID');
                    if( demarcatedUserAssetTransaction.length > 0 ) {
                        await tx('demarcatedUserAssetTransactions').where({ tradeActivityID: tradeActivity[0].id }).update({ status: 'DISCARDED' });
                        
                        if( tradeActivity[0].id ) {
                            const userAsset = await tx('demarcatedUserAssets').where({ planTradeActvityID: tradeActivity[0].id }).limit(1).select('id');
                            if( userAsset.length > 0 && userAsset[0].id ) {
                                await tx('demarcatedUserAssetTransactions').where({ userAssetID: userAsset[0].id }).update({ status: 'DISCARDED' }); 
                                await tx('demarcatedUserAssets').where({ id: userAsset[0].id }).update({ status: 'DISCARDED' });
                            }
                        }
                        await tx('demarcatedUserAssets').whereRaw("id=? AND 0=(SELECT COUNT(demarcatedUserAssetTransactions.id) > 0 FROM demarcatedUserAssetTransactions WHERE demarcatedUserAssetTransactions.userAssetID=demarcatedUserAssets.id AND demarcatedUserAssetTransactions.`status` IN ('LOCKED', 'PENDING'))", [demarcatedUserAssetTransaction[0].userAssetID]).update({ status: 'DISCARDED' });
                    }
                }
                const status = await tx('statusenum').where({ name: 'discard' }).select('id');
                if( status.length > 0 ) {
                    return tx('tradeactivity').where({ queueNumber: queuenumber }).update({ statusID: status[0].id, updatedAt: updatedDate,internalStatus:'discard' });
                } else {
                    throw 'statusenum discard not found!';
                }
            } else {
                throw 'tradeactivity not found';
            }
        } catch(error) {
            console.log("error", error);
            throw error;
        }
    });
    // return knex('statusenum').where({ name: 'discard' }).select('id')
    //     .then(function (result) {
    //         return knex('tradeactivity').where({ queueNumber: queuenumber }).update({ statusID: result[0].id, updatedAt: updatedDate,internalStatus:'discard' })
    //     })
    //     .then(function (result) {
    //         return result;
    //     })
    //     .catch(function (error) {
    //         throw error;
    //     })

}
module.exports = { createtx, updateReceipt,updatetx, discardtx, createTX };