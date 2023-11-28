const blockchainStats = require('./services/supply');
const transferService = require('./services/area-transaction');
const fundingRound = require('./services/funding-round');
const balanceService = require('./services/balance');
const sharedService = require('./services/shared');

module.exports.blockchainStats = blockchainStats;
module.exports.transferService = transferService;
module.exports.fundingRound = fundingRound;
module.exports.balanceService = balanceService;
module.exports.sharedService = sharedService;