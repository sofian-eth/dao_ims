module.exports = {
  'userNextOfKinInformation':function(data){
    this.id = data ? data.id : 0 ;
    this.cnic=  data ? data.cnic : '' ;
    this.address =  data ? data.address : '' ;
    this.fullName =  data ? data.fullName : '' ;
    this.phoneNumber = data ? data.phoneNumber : '' ;
    this.smsNotification = data ? data.smsNotification : 1 ;
    this.pushNotification = data ? data.pushNotification : 1 ;
    this.userID = data ? data.userID : 0;   
    this.profile=data ?  data.profile : "";
    this.portfolioBalance=data? data.portfolioBalance:0;
    this.email=data? data.email:"";
  }
}



