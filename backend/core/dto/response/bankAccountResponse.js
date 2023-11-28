class bankAccountResponse {
  constructor(data) {
    this.id = data ? data.id : 0;
    this.accountTitle = data ? data.accountTitle : '';
    this.bankName = data ? (data.name ? data.name : data.bankName) : '';
    this.bankLogo = data ? (data.bankLogo ? data.bankLogo : data.bankLogo): '';
    this.accountNumber = data ? data.accountNumber : '';
    this.iban = data ? data.iban : '';
    this.branch = data ? data.branch : '';
    this.userID = data ? data.userID : 0;
    this.bankId = data ? data.bankId : 0;
    this.createdAt = data ? new Date(data.createdAt).toDateString("MM-dd-yyyy") : '';
    this.updatedAt = data? new Date(data.updatedAt).toDateString("MM-dd-yyyy") : '';
  }
};

module.exports = { bankAccountResponse }
