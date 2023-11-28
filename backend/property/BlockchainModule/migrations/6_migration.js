const maincontract = artifacts.require('ErContract');


module.exports = function(deployer) {
    deployer.deploy(maincontract,209000,'Elements Residencia (Staging)','ER',1);
      
  };