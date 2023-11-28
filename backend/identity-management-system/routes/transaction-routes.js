const express = require('express');
// const { route } = require('./authentication');
const transactionRoutes = require('../services/Transactions/transaction');

const router = express.Router();

router.get('/',transactionRoutes.transactionListing);

module.exports=router;