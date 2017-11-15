var SportBets = artifacts.require("./SportBets.sol");
//var TestContract = artifacts.require("./TestContract.sol");
module.exports = function (deployer) {
  /*
   deployer.deploy(TestContract, {
     gas: 6712390
   });
   deployer.deploy(ConvertLib, {
     gas: 6712390
   });
   deployer.link(ConvertLib, MetaCoin, {
     gas: 6712390
   });
   deployer.deploy(MetaCoin, {
     gas: 6712390
   });*/
  deployer.deploy(SportBets, {
    gas: 6712390
  });
};
