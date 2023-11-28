const projectContract = artifacts.require('ProjectContract');


module.exports = function(deployer) {
    deployer.deploy(projectContract,209100,'Elements Residencia LLP','ER',4);
      
  };