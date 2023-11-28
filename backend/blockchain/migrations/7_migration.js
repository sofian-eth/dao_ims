const projectContract = artifacts.require('ProjectContract');


module.exports = function(deployer) {
    deployer.deploy(projectContract,19500,'Broad Peek Realty','BPR',4);
      
  };