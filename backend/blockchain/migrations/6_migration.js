const projectContract = artifacts.require('ProjectContract');


module.exports = function(deployer) {
    deployer.deploy(projectContract,5500,'QUBED','QB',4);
      
  };