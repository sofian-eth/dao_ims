
module.exports = class ResponseModel {
    constructor(){
    this.success = true; 
    this.message = '';
    this.error = '' ;
    this.exception =  '';
    this.data = '';    
    }

   setError(error){
    this.error = error;
    this.success = false;

   }
   
  };

  