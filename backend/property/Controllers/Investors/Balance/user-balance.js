const BlockchainUtils = require('../../../utils/blockchain-utils');
const EscrowBalanceModel = require('../../../Models/Investor/PersonalInformation/escrow-balance');
const InvestorBalance = function (investoraddress) {

    var investor_balance;
    return BlockchainUtils.investorbalance(investoraddress)
        .then(function (result) {
            if (result)
                investor_balance = result;

            return investor_balance;
        })
        .catch(function (error) {
            throw 'Error in fetching user balance';
        });


}


const EscrowBalance = function (investorid) {
    return EscrowBalanceModel.EscrowBalance(investorid)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}

module.exports = { InvestorBalance, EscrowBalance };