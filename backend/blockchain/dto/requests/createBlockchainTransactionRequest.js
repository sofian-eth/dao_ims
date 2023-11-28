module.exports = {
  'blockchainTransactionRequest':function(data){
   this.network = data ? data.blockchainConfig.network : '';
   this.buyerAddress = data ? data.buyerAddress: '';
   this.sellerAddress = data ? data.sellerAddress: '';
   this.buyerTronAddress = data ? data.buyerTronAddress: '';
   this.sellerTronAddress = data ? data.sellerTronAddress: '';

   this.walletPassword = data ? data.walletPassword : '';
   this.funds = data ?  data.funds: '';
   this.smartContractAddress = data ? data.smartContractAddress : '';
   
  }
}



