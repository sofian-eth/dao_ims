const maincontract = artifacts.require('ErContract');


module.exports = function(deployer) {
    deployer.deploy(maincontract,2091000000,'Elements Residencia LLP','ER',4);
      
  };