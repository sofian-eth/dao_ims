const sharedUtility = require("./shared");


async function totalSupply (smartContractAddress) {
    let contract = sharedUtility.contractInitializer(smartContractAddress);
    return contract.methods
      .totaltokens()
      .call()
     
      .then(function (result) {
        return result;
      })
      .catch(function (error) {
        throw error;
      });
  };
  

  async function tronContractSupply(smartContractAddress){
    try {
      let tronSupply = await sharedUtility.tronContractTotalSupply(smartContractAddress);
      tronSupply = parseInt(tronSupply,10);
      return tronSupply;
    }
    catch(error){
      throw error;
    }
   
  };


  async function tronCirculationSupply (smartContractAddress) {
    try {
      let tronSupply = await sharedUtility.tronContractCirculationSupply(smartContractAddress);
      tronSupply = parseInt(tronSupply,10);
      return tronSupply;
    }
    catch(error){
      throw error;
    }
 
  };



  async function circulationSupply (smartContractAddress) {
    let contract = sharedUtility.contractInitializer(smartContractAddress);
    return contract.methods
      .circulationsupply()
      .call()
      .then(function (result) {
        return result;
      })
      .catch(function (error) {
        throw error;
      });
  };

  
  module.exports.totalSupply = totalSupply;
  module.exports.circulationSupply = circulationSupply;
  module.exports.tronContractSupply =  tronContractSupply;
  module.exports.tronCirculationSupply = tronCirculationSupply;