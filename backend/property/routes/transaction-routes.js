
const express = require('express');
const transactionRoutes = express.Router();
var multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({
    storage: storage,
    // limits: { fileSize: 500000 },
    fileFilter: function (req, file, cb, res) {

        var filetypes = /jpeg|jpg|png|pdf/;
        var mimetype = filetypes.test(file.mimetype);

        if (mimetype) {
            return cb(null, true);
        }
        return cb(new Error("Error: File upload only supports image or pdf formats "));
    }
})


const transactionDetailController = require('../Controllers/Admin/Transactions/transactiondetails.js');
const adminTransactionController = require('../Controllers/Admin/Transactions/transactions');
const sharedFileController = require('../Controllers/Shared/files');
const adminvalidators = require('../utils/admin-validations');
const transactionAttachmentController = require('../Controllers/Investors/Transactions/attachments');
const userTransactionController = require('../Controllers/Investors/Transactions/transactions');
const userTransactionDetailController = require('../Controllers/Investors/Transactions/transactiondetails');
const userCheckoutController = require('../Controllers/Investors/Checkout/pledgearearequest.js');
const userPermissions = require('../utils/user-authentication');
const mediaService = require('../services/shared/media'); 
// const checkoutService = require('../services/transactions/transaction');
const checkoutService = require('../services/transactions/checkout');

const userTransaction = require('../services/transactions/transaction');



  transactionRoutes.post('/admin/transactiondetails', userPermissions.checkUserPermissions('VIEW_TRANSACTION_DETAILS'), adminvalidators.adminvalidators('transaction-details'), transactionDetailController.transactiondetails);
transactionRoutes.post('/gettxattachment', userPermissions.checkUserPermissions('VIEW_TRANSACTION_ATTACHMENTS'), userTransactionDetailController.txattachments);
// transactionRoutes.post('/admin/createtransaction', userPermissions.checkUserPermissions('CREATE_TRANSACTION'), adminvalidators.adminvalidators('createtransaction'), adminTransactionController.createTransaction);
transactionRoutes.post('/admin/updatetransactions', userPermissions.checkUserPermissions('UPDATE_TRANSACTION'), adminvalidators.adminvalidators('update-transaction'), adminTransactionController.updatetx);
transactionRoutes.post('/admin/discardtransaction', userPermissions.checkUserPermissions('DISCARD_TRANSACTION'), adminvalidators.adminvalidators('discard-transaction'), adminTransactionController.discardtx);
transactionRoutes.post('/admin/trade-attachments', userPermissions.checkUserPermissions('ADD_TRANSACTION_ATTACHMENT'), sharedFileController.tradeAttachments);
transactionRoutes.post('/admin/remove/trade-document', userPermissions.checkUserPermissions('REMOVE_TRANSACTION_ATTACHMENT'), userTransaction.removeTradeAttachments);

transactionRoutes.post('/addattachment', userPermissions.checkUserPermissions('ADD_TRANSACTION_ATTACHMENT'), upload.any(), transactionAttachmentController.addattachments);
transactionRoutes.post('/admin/gettxattachment', userPermissions.checkUserPermissions('VIEW_TRANSACTION_ATTACHMENTS'), transactionDetailController.txattachments);
transactionRoutes.post('/transactiondetails', userPermissions.checkUserPermissions('VIEW_TRANSACTION_DETAILS'), userTransactionDetailController.txdetailscontroller);
transactionRoutes.get('/mytransactions', userPermissions.checkUserPermissions('VIEW_MY_TRANSACTIONS'), userTransactionController.transactions);
transactionRoutes.get('/admin/sales/my_transactions', userPermissions.checkUserPermissions('VIEW_MY_TRANSACTIONS'), userTransactionController.salesTransaction);
transactionRoutes.post('/pledgearea', userPermissions.checkUserPermissions('USER_CAN_INVEST'), userCheckoutController.pledgeArea);
transactionRoutes.get('/admin/transactions', userPermissions.checkUserPermissions('VIEW_ALL_TRANSACTIONS'), adminTransactionController.listtransaction);
transactionRoutes.get('/txsearch', userPermissions.checkUserPermissions('VIEW_MY_TRANSACTIONS'), userTransactionController.searchtransactions);
transactionRoutes.post('/sales/transaction_details', userPermissions.checkUserPermissions('VIEW_TRANSACTION_DETAILS'), userTransactionDetailController.txdetailscontroller);
transactionRoutes.post('/admin/transaction/generate-sale-receipt', userPermissions.checkUserPermissions('VIEW_TRANSACTION_DETAILS'),userTransaction.generateSalesReceipt );
transactionRoutes.get('/admin/transaction-stats', userPermissions.checkUserPermissions('VIEW_ALL_TRANSACTIONS'), adminTransactionController.transactionStats);
transactionRoutes.get('/admin/transaction/deposit-slip', userPermissions.checkUserPermissions('VIEW_ALL_TRANSACTIONS'), adminTransactionController.transactionListingWithDepositSlip);
transactionRoutes.get('/admin/transaction-test', adminTransactionController.transactionFetch);
transactionRoutes.post('/trade-attachments', userPermissions.checkUserPermissions('ADD_TRANSACTION_ATTACHMENT'), transactionAttachmentController.transactionAttachments);
transactionRoutes.get('/admin/transactions/:id/sendPledgeEmail', userPermissions.basicAdminAuth("SEND_PLEDGE_EMAIL_WITH_API"), adminTransactionController.sendPledgeEmail);





transactionRoutes.post('/user/checkout',userPermissions.checkUserPermissions('USER_CAN_INVEST'),checkoutService.userCheckout);

transactionRoutes.get('/user/transaction/list');
transactionRoutes.post('/user/transaction/detail');
transactionRoutes.post('/user/transaction/update');
transactionRoutes.post('/user/transaction/document/list');
transactionRoutes.post('/user/transaction/document/add');
transactionRoutes.post('/user/transaction/document/remove',userPermissions.checkUserPermissions('UPDATE_TRANSACTION'),userTransaction.removeTradeAttachments);
transactionRoutes.put('/user/transactions/:id', userPermissions.checkUserPermissions('UPDATE_TRANSACTION'), userPermissions.allowUpdateTransaction, userTransaction.updateTransactions)

transactionRoutes.get('/user/transaction/projects',userPermissions.checkUserPermissions('USER_CAN_INVEST'),userTransaction.investorTransaction);
transactionRoutes.post('/user/transaction/project/detail',userPermissions.checkUserPermissions('VIEW_TRANSACTION_DETAILS'),userTransaction.investorTransactionDetail);
transactionRoutes.post('/user/update/transfer',userPermissions.checkUserPermissions('USER_CAN_INVEST'),userTransaction.transactionUpdate);


transactionRoutes.post('/admin/transaction/create', userPermissions.checkUserPermissions('CREATE_TRANSACTION'),userTransaction.adminCreateTransaction);
transactionRoutes.get('/user/totalPurchasedArea', userPermissions.checkUserPermissions('VIEW_MY_TRANSACTIONS'), userTransaction.totalPurchasedArea)

//transactionRoutes.post('/admin/transactiondetails', adminvalidators.adminvalidators('transaction-details'), transactionDetailController.transactiondetails);

transactionRoutes.post('/admin/addComments', userPermissions.checkUserPermissions('VIEW_TEAM_MEMBERS'),userTransaction.addComments);
transactionRoutes.get('/admin/getComments',userTransaction.getComments);
transactionRoutes.put('/admin/updateAgentAndStatus',userTransaction.updateAgentAndStatus);


module.exports = { transactionRoutes };
