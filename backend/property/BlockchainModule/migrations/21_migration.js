const maincontract = artifacts.require('ErContract');


module.exports = function(deployer) {
    deployer.deploy(maincontract,209100,'Elements Residencia LLP','ER',4);
      
  };