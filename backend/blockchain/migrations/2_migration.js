const projectContract = artifacts.require('ProjectContract');


module.exports = function(deployer) {
    deployer.deploy(projectContract,600000,'URBAN DWELLINGS (PRIVATE) LIMITED','UD',4);
      
  };