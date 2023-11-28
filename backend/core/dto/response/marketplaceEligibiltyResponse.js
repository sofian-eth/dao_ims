class marketplaceEligibiltyResponse {
    constructor(data){
        this.userID = data.id ? data.id : 0;
        // this.bankAccountFound = data && data.userBankInformations ? data.userBankInformations.length : 0;
        // this.addressFoud = data && data.userAddressBooks && data.userAddressBooks.length > 0 ? true : false;
        this.bankAccountFound = data && data.banksCount?data.banksCount : 0;
        this.addressFoud = data && data.addressCount && data.addressCount > 0 ? true : false
        this.MobileVerified = data.is_phonenumber_verified ? true : false;
        this.emailVerified = data.is_email_verified ? true : false;
        this.cnicFound = data.identityCardNumber ? true : false;
        this.createdAt = new Date(data.createdAt).toDateString("MM-dd-yyyy");
        this.updatedAt = new Date(data.updatedAt).toDateString("MM-dd-yyyy");        
    }
};

module.exports = { marketplaceEligibiltyResponse }
  