const express = require('express');
const blockchainRouter = express.Router();
const blockchainController = require('../Controllers/Admin/Transactions/blockchaincontroller.js');
const userPermissions = require('../utils/user-authentication');
const blockchainTest = require('../utils/blockchain-utils');
const sharedBlockchainController = require('../Controllers/Shared/blockchain');
blockchainRouter.post('/admin/blockchaintx', userPermissions.checkUserPermissions('POST_TRANSACTION_ON_BLOCKCHAIN'), blockchainController.blockchaincontroller);
blockchainRouter.get('/blockchainbalance', userPermissions.checkUserPermissions(), blockchainController.userbalance);


const blockchain = require('blockchain');


// blockchainRouter.post('/transfer',sharedBlockchainController.transfer);
// blockchainRouter.get('/total-supply',sharedBlockchainController.totalSupply);
 blockchainRouter.get('/circulation-supply',sharedBlockchainController.tronCirculationSupply);
// blockchainRouter.post('/lock-funds',sharedBlockchainController.tronLockFunds); 
// blockchainRouter.post('/unlock-funds',sharedBlockchainController.tronUnlockFunds);
// blockchainRouter.get('/receipt',blockchain.balanceService.fetchTransactionReceipt);
blockchainRouter.get('/blockchain-stats',sharedBlockchainController.blockchainStats);


blockchainRouter.post('/investor_balance',sharedBlockchainController.investorBalance);


module.exports = { blockchainRouter }