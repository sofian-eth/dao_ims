class sendEidiRequest{
  
    constructor(obj={}){
        this.to = obj.to?obj.to:0;
        this.from = obj.from?obj.from:"";
        this.existingUser = obj.exisitngnUser?obj.exisitngnUser:0;
        this.firstName = obj.firstName?obj.firstName:"";
        this.email = obj.email?obj.email:"";
        this.phoneNumber = obj.phoneNumber?obj.phoneNumber:"";
        this.message = obj.message?obj.message:"";
        this.sqft = obj.sqft?obj.sqft:"";
        this.projectID = obj.projectID?obj.projectID:0;
    }
    
    
}
module.exports = {sendEidiRequest};