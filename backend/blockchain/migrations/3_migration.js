const projectContract = artifacts.require('ProjectContract');


module.exports = function(deployer) {
    deployer.deploy(projectContract,550927,'URBAN DWELLINGS','UD',4);
      
  };