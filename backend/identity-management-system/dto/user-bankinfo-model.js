module.exports = {
  'userBankInfoModal':function(data = {}){
    this.id = data ? data.id : 0 ;
    this.accountTitle=  data && data.accountTitle ? data.accountTitle : '' ;
    this.bankName =  data && data.bankName ? data.bankName : '' ;
    this.accountNumber =  data && data.accountNumber ? data.accountNumber : '' ;
    this.iban = data && data.iban ? data.iban : '' ;
    this.branch = data && data.branch ? data.branch : '' ;
    this.userID = data && data.userID ? data.userID : 0;
    this.svg = data && data.svg ? data.svg:'';
    this.name = data&&data.name ? data.name:'';
    this.bankId = data&&data.bankId?data.bankId : 0
  }
}



