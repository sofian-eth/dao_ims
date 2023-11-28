const addressBookResponse = require('./addressbookResponse');
const bankAccountResponse = require('./bankAccountResponse');
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const investmentResponse = require('./investmentResponse');
class userResponse {
  constructor(data) {
    this.id = data.id ? data.id : 0;
    this.legalName = data.legalName;
    this.nickName = data.nickName;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.phoneNumberDetail = data.phoneNumber ? this.getCountryCode(data.phoneNumber): null;
    this.isPhoneVerified = data.is_phonenumber_verified;
    this.isEmailVerified = data.is_email_verified;
    this.source = data.source;
    this.roleID = data.roleID;
    this.walletAddress = data.walletAddress;
    this.membershipNumber = data.membershipNumber;
    this.isBasicInfoAvailable = data.isBasicInfoAvailable;
    this.dateOfBirth = data.dateOfBirth;
    this.businessInformation = data.businessInformation;
    this.billingAddress = data.billingAddress;
    this.addressLine1 = data.addressLine1;
    this.addressLine2 = data.addressLine2;
    this.shippingAddress = data.shippingAddress;
    this.city = data.city;
    this.country = data.country;
    this.province = data.province;
    this.iskycApproved = data.iskycApproved==1 ? true : false;
    this.identityCardNumber = data.identityCardNumber;
    this.initialInvestmentBudget = data.initialInvestmentBudget;
    this.createdAt = data.createdAt;
    this.permissions = data.permissions;
    this.cnicFront = data.cnicFront;
    this.cnicBack = data.cnicBack;
    this.loginCount = data.loginCount;
    this.gender = data.gender ? data.gender : '';
    this.ntn = data.ntn ? data.ntn : '';
    this.isSuspended = data.isSuspend ? data.isSuspend : false;
    this.profilePicture = data.profilePicture ? data.profilePicture : "";
    this.pushNotification = "pushNotification" in data ? data.pushNotification : true;
    this.smsNotification = "smsNotification" in data ? data.smsNotification : true;
    this.isSocialUser = this.isSocialUser(data.password);
    this.addresses = data.userAddressBooks && userAddressBooks.length > 0 ? this.getUserAddresses(data.userAddressBooks) : [];
    this.bankAccounts = data.userBankInformations && userBankInformations.length > 0 ? this.getUserBankAccounts(data.userBankInformations) : [];
    this.activeInvestments = data.activeInvestments && data.activeInvestments.length > 0 ? this.activeInvestments(data.activeInvestments) : []; 
    
  }

  /* 
  check if a user is from some social network 
  */
  isSocialUser(_pass){
    if (_pass) {
      return false
    } else {
      return true
    }
  }

  getUserAddresses(_addresses) {
    let _userAddresses = []
        for (let index = 0; index < _addresses.length; index++) {  
          _userAddresses.push(new addressBookResponse(_addresses[index]));
        }
        return _userAddresses;
  }

  getCountryCode(_phoneNumber){
    let obj = {
      countryCode : "92",
      rawNumber : "",
      countryShortCode : "pk"
    
    };
    let number = phoneUtil.parseAndKeepRawInput(_phoneNumber,"pk");
    obj.countryCode = number.getCountryCode();
    obj.rawNumber = number.getNationalNumber();
    obj.countryShortCode = phoneUtil.getRegionCodeForNumber(number);
    return obj;

  }

  getUserBankAccounts(_bankAccounts) {
    let _userBankAccounts = []
        for (let index = 0; index < _bankAccounts.length; index++) {  
          _userBankAccounts.push(new bankAccountResponse(_bankAccounts[index]));
        }
        return _userBankAccounts;
  }


  activeInvestments(_activeInvestments){
    let _investments = [];
    for (let investmentIndex = 0 ; investmentIndex < _activeInvestments.length; investmentIndex++){
      _investments.push(new investmentResponse(_activeInvestments[investmentIndex]));
    }

    return _investments;
  }

}

class UserOrdersStats {
  constructor(data) {
      this.buying = (data&&data.totalBuyingDeals) ? data.totalBuyingDeals : 0;
      this.selling = (data&&data.totalSellingOrders) ? data.totalSellingOrders : 0;
      this.totalActiveOrders = (data&&data.totalActiveSellingOrders) ? data.totalActiveSellingOrders : 0;
      this.totalInactiveOrders = (data&&data.totalInactiveSellingOrders) ? data.totalInactiveSellingOrders : 0;
      this.totalCompletedOrders = (data&&data.totalCompletedSellingOrders) ? data.totalCompletedSellingOrders : 0;
  }
}



module.exports = {userResponse, UserOrdersStats};
