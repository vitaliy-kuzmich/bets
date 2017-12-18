var SportBets = artifacts.require("./SportBets.sol");
/*
rm -rf build/ && truffle migrate --reset && truffle test
*
*
* */

//var instance; SportBets.deployed().then(rs=>instance = rs);
//instance.addTeam.sendTransaction("f","t1","d1");
//instance.addGame.sendTransaction("f",[0,1],1,2,true,"d1",100,true,1);
// var t; TestContract.deployed().then(rs=>t = rs);

var game = "football";

web3.toAsciiOriginal = web3.toAscii;
web3.toAscii = function (input) {
  return web3.toAsciiOriginal(input).replace(/\u0000/g, '')
}


contract('SportBets', (accs) => {
  var accounts = accs;
  var owner = accounts[0]

  it("should CRUD", async () => {

    let instance = await SportBets.deployed();

    instance.addGame.sendTransaction(game, [1, 2], new Date().getTime() / 1000, new Date().getTime() / 1000 + 5, true, 100, "game location descr1", 1);
    instance.addGame.sendTransaction(game, [2, 1], new Date().getTime() / 1000, new Date().getTime() / 1000 + 5, true, 100, "game location descr2", 2);
    assert.equal(2, (await instance.getGamesLen.call()).valueOf(), "games count expected to be 2");

    //uint _startIndex, bytes32 _filterSportType, uint _filterStartDateBefore, bool _allowDraw

    let featureBeforeStartFilter = new Date();
    let filterDateTime = new Date(featureBeforeStartFilter.setTime(featureBeforeStartFilter.getTime() + 2 * 86400000)).getTime() / 1000;
    let games = await instance.iterateGames(0, game, filterDateTime, true);


    assert.equal(web3.toAscii(games[2][0]), "game location descr1", "game details must be equals");
    assert.equal(2, games[0].length, "games count expected to be 2");

    let details = await instance.getGameDetails.call(3);
    assert.equal(details[1], details[2], "payout not ready");

  });

  it("should BETS", async () => {

    let instance = await SportBets.deployed();

    instance.addGame.sendTransaction(game, [1, 2], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr", 3);
    instance.addGame.sendTransaction(game, [2, 1], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr2", 4);
    instance.addGame.sendTransaction(game, [3, 1], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr3", 5);
    instance.addGame.sendTransaction(game, [3, 2], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr4", 6);
    // bet(uint _gameId, uint _teamId, bool _isDraw, BetType _type

    let details = await instance.getGameDetails.call(4);

    instance.bet.sendTransaction(4, 2, false, {from: accounts[1], value: 101});
    instance.bet.sendTransaction(4, 2, false, {from: accounts[2], value: 101});
    instance.bet.sendTransaction(4, 2, false, {from: accounts[3], value: 101});

    instance.bet.sendTransaction(4, 1, false, {from: accounts[2], value: 101});
    instance.bet.sendTransaction(4, 1, false, {from: accounts[3], value: 101});

    instance.bet.sendTransaction(4, 0, true, {from: accounts[4], value: 101});
    instance.bet.sendTransaction(4, 0, true, {from: accounts[5], value: 101});
    instance.bet.sendTransaction(4, 0, true, {from: accounts[6], value: 101});


    let rate = await instance.getBetRate.call(4);
    assert.equal(rate[1][0].valueOf(), 303, "Bet rates does not real?");
    assert.equal(rate[1][2].valueOf(), 303, "Draw bet rates does not real?");

    let featureBeforeStartFilter = new Date();

  });

  it("should payout and delete game", async () => {

    let instance = await SportBets.deployed();
    instance.addGame.sendTransaction(game, [1, 2], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr", 7);
    instance.addGame.sendTransaction(game, [2, 1], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr2", 8);
    instance.addGame.sendTransaction(game, [3, 1], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr3", 9);
    instance.addGame.sendTransaction(game, [1, 2], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr4", 10);
    // bet(uint _gameId, uint _teamId, bool _isDraw, BetType _type

    instance.bet.sendTransaction(10, 2, false, {from: accounts[1], value: 101});
    instance.bet.sendTransaction(10, 2, false, {from: accounts[2], value: 101});
    instance.bet.sendTransaction(10, 2, false, {from: accounts[3], value: 101});

    instance.bet.sendTransaction(10, 1, false, {from: accounts[2], value: 101});
    instance.bet.sendTransaction(10, 1, false, {from: accounts[3], value: 101});

    instance.bet.sendTransaction(10, 0, true, {from: accounts[4], value: 101});
    instance.bet.sendTransaction(10, 0, true, {from: accounts[5], value: 101});
    instance.bet.sendTransaction(10, 0, true, {from: accounts[6], value: 101});

    let rateOld = await instance.getBetRate.call(10);

    //uint _gameId, uint[] _drawBetToPayouts, uint[] _teamIdsLimits, uint[] _payoutAmount

    instance.payout.sendTransaction(10, [101, 101, 101], [101, 101, 101, 101, 101]);

    let details = await instance.getGameDetails.call(10);
    assert.equal(true, details[1], "payout ready");


    instance.refund(4).then((tx) => {
      assert.equal(true, false, "Expected refund error missed");
    }).catch((err) => {
      assert.equal(true, err != undefined, "Double payment!");
    })
    assert.equal(false, details[2], "refund not ready");

    let rate = await instance.getBetRate.call(10);
    assert.equal(303, rate[1][2].valueOf(), "Wrong bet rate");


    let allBets = await instance.getBets(10);
    assert.equal(8, allBets[1].length, "Wrong bets count ");

    instance.deleteGame.sendTransaction(10);
    assert.equal(9, (await instance.getGamesLen.call()).valueOf(), "games count expected to be 1");
    instance.addGame.sendTransaction(game, [1, 2], new Date().getTime() / 1000, new Date().getTime() / 1000 + 5, true, 100, "game location descr1", 11);
    assert.equal(10, (await instance.getGamesLen.call()).valueOf(), "games count expected to be 2");

  });
    it("should refund", async () => {
      let instance = await SportBets.deployed();
      instance.addGame.sendTransaction(game, [1, 2], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr", 12);
      instance.addGame.sendTransaction(game, [2, 1], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr2", 13);
      instance.addGame.sendTransaction(game, [3, 1], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr3", 14);
      instance.addGame.sendTransaction(game, [3, 2], (new Date().getTime() / 1000) + 1000, (new Date().getTime() / 1000) + 1100, true, 100, "game location descr4", 15);
      // bet(uint _gameId, uint _teamId, bool _isDraw, BetType _type

      instance.bet.sendTransaction(3, 2, false, {from: accounts[1], value: 101});
      instance.bet.sendTransaction(3, 2, false, {from: accounts[2], value: 101});
      instance.bet.sendTransaction(3, 2, false, {from: accounts[3], value: 101});

      instance.bet.sendTransaction(3, 1, false, {from: accounts[2], value: 101});
      instance.bet.sendTransaction(3, 1, false, {from: accounts[3], value: 101});

      instance.bet.sendTransaction(3, 0, true, {from: accounts[4], value: 101});
      instance.bet.sendTransaction(3, 0, true, {from: accounts[5], value: 101});
      instance.bet.sendTransaction(3, 0, true, {from: accounts[6], value: 101});


      instance.refund.sendTransaction(3);
      let details = await instance.getGameDetails.call(3);
      assert.equal(false, details[1], "payout not ready");
      assert.equal(true, details[2], "already refunded");
      //console.dir(details);

    })
})
