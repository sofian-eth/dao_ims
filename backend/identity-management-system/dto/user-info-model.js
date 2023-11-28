module.exports = {
  'userInfoModal':function(data){
    this.id = data.id ? data.id : 0 ;
    this.legalName =  data.legalName;  
    this.email =  data.email;
    this.phoneNumber =  data.phoneNumber ;
    this.isPhoneVerified = data.is_phonenumber_verified;
    this.isEmailVerified = data.is_email_verified;
    this.source = data.source ;
    this.roleID =data.roleID ;
    this.type = data.type;
    this.walletAddress = data.walletAddress ;
    this.tronAddress = data.tronAddress ;
    this.membershipNumber = data.membershipNumber;
    this.isBasicInfoAvailable = data.isBasicInfoAvailable ;
    this.dateOfBirth = data.dateOfBirth ;
    this.businessInformation =   data.businessInformation ;
    this.billingAddress =  data.billingAddress ;
    this.addressLine1 =  data.addressLine1 ;
    this.addressLine2 =  data.addressLine2 ;
    this.shippingAddress = data.shippingAddress ;
    this.city = data.city ;
    this.country = data.country ;
    this.province = data.province ;
    this.isKycApproved = data.isKycApproved ;
    this.identityCardNumber = data.identityCardNumber ;
    this.initialInvestmentBudget = data.initialInvestmentBudget ;
    this.nickName = data ? data.nickName: '';
    this.createdAt = data.createdAt;
    this.permissions = data.permissions;
    this.cnicFront = data.cnicFront;
    this.cnicBack = data.cnicBack;
    this.loginCount = data.loginCount;
    this.gender = data.gender ? data.gender : '';
    this.ntn = data.ntn ? data.ntn : '';
    this.isSuspended = data.isSuspend?data.isSuspend:false;
    this.profilePicture = data.profilePicture ? data.profilePicture : "";
    this.pushNotification = "pushNotification" in  data ? data.pushNotification : true;
    this.smsNotification = "smsNotification" in data ? data.smsNotification : true;
    this.refferalCode = data.refferalCode;
    this.isFiler = data.isFiler !== null ? (data.isFiler == true ? true : false ) : null;
    this.iskycApproved = data.iskycApproved===1 ? true : false;
    if(data.password){
      this.isSocialUser = false
    }else{
      this.isSocialUser = true
    }
  }
}



