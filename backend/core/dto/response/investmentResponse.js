class investmentResponse {
    constructor(data) {
      this.propertyName = data ? data.propertyName : '';
      this.balance = data ? data.balance : 0;
      this.netInvestment = data ? data.netInvestment : 0;
      this.createdAt = data.createdAt ? new Date(data.createdAt).toDateString("MM-dd-yyyy") : '';
      this.updatedAt = data.updatedAt ? new Date(data.updatedAt).toDateString("MM-dd-yyyy") : '';
    }
  };
  
  module.exports =  investmentResponse ;
  