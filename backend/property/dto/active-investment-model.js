// module.exports = {
//     'activeInvestmentModel':function(data){
//       this.propertyName =  data.propertyName;  
//       this.areaUnits =  data.areaUnits;
//       this.propertyCoverPhoto = data.propertyCoverPhoto;
//       this.purchasedPrice =  data.purchasedPrice;
//       this.currentValue =   data.currentValue;
     
//     }
//   }
  
  

module.exports = {
  'activeInvestmentModel':function(data){
   this.investments = data.investments;
   this.totalArea = data.totalArea;
   this.totalActualInvestment = data.netActualInvestment;
   this.currentActualInvestment = data.netCurrentInvestment;
   this.netAmountWithdrawn = data.netAmountWithdrawn;
   this.onCompletionInvestment = data.onCompletionInvestment;
  }
}

