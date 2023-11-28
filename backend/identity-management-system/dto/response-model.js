
module.exports = class ResponseModel {
    constructor(){
    this.success = true; 
    this.message = '';
    this.error = '' ;
    this.exception =  '';
    this.data = '';    
    }

   setError(error, errorCode = ''){
    this.error = errorCode ? errorCode : error;
    this.success = false;
    this.message = error;
   }
   
  };

  