const maturePropertyContract = artifacts.require('maturePropertyContract');


module.exports = function(deployer) {
    deployer.deploy(maturePropertyContract,55000,'Acron Building ','ACR',4);
      
  };