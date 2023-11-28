
// const fileEnum = require('../../resources/fileEnum');
// const userKycModel = require('../../Models/Investor/PersonalInformation/personalinformation');
// const transactionModel = require('../../Models/Investor/Transactions/ticketdetails');


// async function saveFile(req,res,next){

// try {    
//     let operationType = req.body.operationType;

//     let type = operationType;

//     if(!type)
//         throw 'Invalid operation';

//     switch(type){
//         case fileEnum.userKyc:
//             let response = await userKycModel.updateKyc(req.decoded.id,req.body.cnicFrontId,req.body.cnicBackId);
//             return res.status(200).json({error:false,message:'File added successfully',data:''});
//         case fileEnum.transaction:
//             let attachmentsArray = body.txAttachments;
//             let tradeAttachment = [];
//             let object = {};
//             for (var i = 0; i < attachmentsArray.length; i++) {
//                 let object = {};
//                 object.tradeID = req.body.tradeId;
//                 object.documentId = parseInt(attachmentsArray[i]);
//                 tradeAttachment.push(object);
//             };
//             let response = await transactionModel.updateTransactionDocuments(object);
//             return res.status(200).json({error:false,message:'File added successfully',data:''});
//     }


//    } catch(error){
//     err.statusCode = 400;
//     err.message = "Error occurred in fetching transactions";
//     err.stackTrace = error;
//     next(err);
//    }

//   }


//   module.exports.saveFile = saveFile;