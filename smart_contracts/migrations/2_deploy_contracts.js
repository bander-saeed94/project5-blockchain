var myContract = artifacts.require("StarNotary");

module.exports = function(deployer) {
  deployer.deploy(myContract);
};