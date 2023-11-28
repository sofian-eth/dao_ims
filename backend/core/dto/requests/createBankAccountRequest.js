class createBankAccountRequest {
  constructor(data, userID){
    this.id = data ? data.id : 0 ;
    this.accountTitle=  data ? data.accountTitle : '' ;
    this.bankName =  data ? data.bankName : '' ;
    this.accountNumber =  data ? data.accountNumber : '' ;
    this.iban = data ? data.iban : '' ;
    this.branch = data && data.branch ? data.branch : '' ;
    this.userID = userID ? userID : 0;
    this.bankId = data && data.bankId ? data.bankId : '' ;
    this.propertyID = data && data.property ? data.property : null ;
    this.rentalUpdate = data && data.rentalUpdate ? data.rentalUpdate : false;
    this.isRemoveError = data && data.isRemoveError ? true : false;
    
  }
};

module.exports = { createBankAccountRequest }
