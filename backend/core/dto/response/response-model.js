
module.exports = class ResponseModel {
    constructor(){
    this.success = true; 
    this.message = '';
    this.errorCode = '' ;
    this.exception =  '';
    this.data = '';    
    }

   setError(error, errorCode = ''){
    this.errorCode = errorCode;
    this.success = false;
    this.message = error;
   }

   setSuccess(message){
    this.success = true;
    this.message = message;
    this.errorCode = '';
   }
   
  };

  