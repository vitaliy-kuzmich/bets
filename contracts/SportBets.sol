pragma solidity ^0.4.0;


/**
 * vitaliy.kuzmich[at]gmail.com
 */
contract SportBets {

  function SportBets() payable public {
    owner = msg.sender;
  }
  modifier isOwner{
    require(msg.sender == owner);
    _;
  }
  modifier gameExists(uint _gameId){

    require(gamesMap[_gameId].externalId != 0);
    _;
  }

  struct Bet {
    address addr;
    uint amount;
  }


  struct Game {
    uint[] teamIds;
    mapping(uint => Bet[]) bets;

    //game status
    Bet[] drawBets;
    bool payoutLock;
    bool wasRefund;
    //end game status

    uint startDate;
    uint endDate;

    bytes32 description;
    bytes32 sportType;
    uint externalId;

    uint minBetAmount;
    bool allowDrawBets;

  }

  address public owner;


  mapping(uint => Game) gamesMap;

  uint[] public gameIds;

  function changeOwner() public isOwner returns (address) {
    owner = msg.sender;
    return owner;
  }

  /**
  * Calculating done externally because of lack of decimal arithmetics. It makes sure that payments was not done before.
  *
  */
  function payout(uint _gameId, uint[] _drawBetToPayouts, uint[] _payoutAmount) isOwner public {

    require(!gamesMap[_gameId].payoutLock
    //&& now > gamesMap[_gameId].endDate
    && !gamesMap[_gameId].wasRefund);

    gamesMap[_gameId].payoutLock = true;

    for (uint i = 0; i < _drawBetToPayouts.length; i++) {
      gamesMap[_gameId].drawBets[i].addr.transfer(_drawBetToPayouts[i]);
    }


    uint teamIdIndex = 0;
    uint betsIndex = 0;
    Bet[] memory currentBets = gamesMap[_gameId].bets[gamesMap[_gameId].teamIds[teamIdIndex]];
    //payout the rest bidders

    for (i = 0; i < _payoutAmount.length; i++) {

      if (currentBets.length == betsIndex && i < _payoutAmount.length - 1) {
        betsIndex = 0;
        teamIdIndex++;
        require(teamIdIndex < gamesMap[_gameId].teamIds.length);
        currentBets = gamesMap[_gameId].bets[gamesMap[_gameId].teamIds[teamIdIndex]];
      }

      currentBets[betsIndex].addr.transfer(_payoutAmount[i]);
      betsIndex++;


    }


  }
  /**
  putting money on game/team/draw
   */
  function bet(uint _gameId, uint _teamId, bool _isDraw) payable public {
    require(msg.value >= gamesMap[_gameId].minBetAmount &&
      // now < gamesMap[_gameId].startDate &&
      !gamesMap[_gameId].wasRefund);

    if (_isDraw) {
      require(gamesMap[_gameId].allowDrawBets);
    }

    if (!_isDraw) {
      var teamMatch = false;
      for (uint i = 0; i < gamesMap[_gameId].teamIds.length; i++) {
        if (gamesMap[_gameId].teamIds[i] == _teamId) {
          teamMatch = true;
        }
      }
      require(teamMatch);
    }

    if (_isDraw) {
      gamesMap[_gameId].drawBets.push(Bet({
        addr : msg.sender,
        amount : msg.value
        }));
    }
    else {
      gamesMap[_gameId].bets[_teamId].push(Bet({
        addr : msg.sender,
        amount : msg.value
        }));
    }
  }


  /**
returns teamId, betAmount, latestIndex - draw bets
*/
  function getBetRate(uint _gameId) gameExists(_gameId) public view returns (uint[], uint[]) {

    uint size = gamesMap[_gameId].teamIds.length;
    uint[] memory resultBetsRes = new uint[](size + 1);
    uint[] memory teamIdsRes = new uint[](size + 1);
    teamIdsRes[size] = 0;

    for (uint i = 0; i < size; i++) {
      teamIdsRes[i] = gamesMap[_gameId].teamIds[i];
      for (uint j = 0; j < gamesMap[_gameId].bets[teamIdsRes[i]].length; j++) {
        resultBetsRes[i] += gamesMap[_gameId].bets[teamIdsRes[i]][j].amount;
      }
    }
    if (gamesMap[_gameId].allowDrawBets) {
      for (i = 0; i < gamesMap[_gameId].drawBets.length; i++) {
        resultBetsRes[size] += gamesMap[_gameId].drawBets[i].amount;
      }
    }

    return (teamIdsRes, resultBetsRes);
  }
  /**
  returns all bids
   */
  function getBets(uint _gameId) public view returns (uint[], address[], uint[]) {

    uint betsSize = gamesMap[_gameId].drawBets.length;
    uint[] memory betsShiftIndex = new uint[](gamesMap[_gameId].teamIds.length);

    for (uint i = 0; i < gamesMap[_gameId].teamIds.length; i++) {
      betsShiftIndex[i] = gamesMap[_gameId].bets[gamesMap[_gameId].teamIds[i]].length;
      betsSize += betsShiftIndex[i];
    }
    //betsShiftIndex[gamesMap[_gameId].teamIds.length] = betsSize - gamesMap[_gameId].drawBets.length;

    address[] memory bidders = new address[](betsSize);
    uint[] memory amounts = new uint[](betsSize);

    (bidders, amounts) = fillBets(_gameId, bidders, amounts);
    return (betsShiftIndex, bidders, amounts);
  }
  /**
  used internally in order to fill bets data
   */
  function fillBets(uint _gameId, address[] memory bidders, uint[] memory amounts) public view returns (address[], uint[]) {
    uint counter = 0;
    for (uint i = 0; i < gamesMap[_gameId].teamIds.length; i++) {
      for (uint j = 0; j < gamesMap[_gameId].bets[gamesMap[_gameId].teamIds[i]].length; j++) {
        bidders[counter] = gamesMap[_gameId].bets[gamesMap[_gameId].teamIds[i]][j].addr;
        amounts[counter] = gamesMap[_gameId].bets[gamesMap[_gameId].teamIds[i]][j].amount;

        counter++;
      }
    }
    for (i = 0; i < gamesMap[_gameId].drawBets.length; i++) {
      bidders[counter] = gamesMap[_gameId].drawBets[i].addr;
      amounts[counter] = gamesMap[_gameId].drawBets[i].amount;

      counter++;
    }


    return (bidders, amounts);

  }

  /**
  returns total bets count
   */
  function getBetsCount(uint _gameId) public view returns (uint){
    uint count = gamesMap[_gameId].drawBets.length;

    for (uint i = 0; i < gamesMap[_gameId].teamIds.length; i++) {
      count += gamesMap[_gameId].bets[gamesMap[_gameId].teamIds[i]].length;
    }
    return count;

  }
  /**

  add new game
   */

  function addGame(
    bytes32 _sportType,
    uint[] _teamIds,
    uint _startDate,
    uint _endDate,
    bool _allowDraw,
    uint _minBetAmount,
    bytes32 _description,
    uint _externalId
  ) public isOwner
  {
    require(gamesMap[_externalId].externalId == 0);

    gamesMap[_externalId].teamIds = _teamIds;
    gamesMap[_externalId].startDate = _startDate;
    gamesMap[_externalId].endDate = _endDate;
    gamesMap[_externalId].description = _description;
    gamesMap[_externalId].sportType = _sportType;
    gamesMap[_externalId].minBetAmount = _minBetAmount;
    gamesMap[_externalId].allowDrawBets = _allowDraw;
    gamesMap[_externalId].externalId = _externalId;

    gameIds.push(_externalId);

  }


  /**
   used by clients in order to iterate existing games
   */

  function iterateGames(uint _startIndex, bytes32 _filterSportType, uint _filterStartDateBefore, bool _allowDraw) public view returns (
    uint[],
    uint[],
    bytes32[]
  ){

    uint j = 0;
    for (uint i = _startIndex; i < gameIds.length; i++) {
      if (j == 10) {
        break;
      }
      Game storage game = gamesMap[gameIds[i]];
      if (game.startDate <= _filterStartDateBefore
      && _filterSportType == game.sportType
      && _allowDraw == game.allowDrawBets) {
        j++;
      }
    }
    uint size = j;
    j = 0;

    uint[] memory ids = new uint[](size);
    uint[]memory startDates = new uint[](size);
    bytes32[] memory descr = new bytes32[](size);

    for (i = _startIndex; i < gameIds.length; i++) {
      if (j == size) {
        break;
      }
      game = gamesMap[gameIds[i]];
      if (game.startDate <= _filterStartDateBefore
      && _filterSportType == game.sportType
      && _allowDraw == game.allowDrawBets) {
        ids[j] = game.externalId;
        startDates[j] = game.startDate;
        descr[j] = game.description;
        j++;
      }
    }


    return (ids, startDates, descr);

  }

  /**
  returns additional details about game
   */

  function getGameDetails(uint _id) public view returns (
    uint[] teamIds_,

    bool payoutLock_,
    bool wasRefund_,

    uint endDate_,
    uint minBetAmount_,

    bool allowDrawBets_
  ){
    teamIds_ = gamesMap[_id].teamIds;

    payoutLock_ = gamesMap[_id].payoutLock;
    wasRefund_ = gamesMap[_id].wasRefund;

    endDate_ = gamesMap[_id].endDate;
    minBetAmount_ = gamesMap[_id].minBetAmount;

    allowDrawBets_ = gamesMap[_id].allowDrawBets;

  }

  function getGamesLen() public view returns (uint){
    return gameIds.length;

  }

  /**
  delete game and it makes sure that payments were done
   */
  function deleteGame(uint _id) public isOwner {
    require(gamesMap[_id].payoutLock || gamesMap[_id].wasRefund);
    delete gamesMap[_id];
    for (uint i = 0; i < gameIds.length; i++) {
      if (gameIds[i] == _id) {
        gameIds[i] = gameIds[gameIds.length - 1];
        gameIds.length--;
        break;
      }
    }

  }
  /**
  In case game canceled, it makes sure that payments were NOT done before
  */
  function refund(uint _id) public isOwner {
    require(!gamesMap[_id].wasRefund && !gamesMap[_id].payoutLock);
    gamesMap[_id].wasRefund = true;
    for (uint i = 0; i < gamesMap[_id].drawBets.length; i++) {
      gamesMap[_id].drawBets[i].addr.transfer(gamesMap[_id].drawBets[i].amount);
    }
    for (i = 0; i < gamesMap[_id].teamIds.length; i++) {
      uint teamI = gamesMap[_id].teamIds[i];
      for (uint j = 0; j < gamesMap[_id].teamIds.length; j++) {
        gamesMap[_id].bets[teamI][j].addr.transfer(gamesMap[_id].bets[teamI][j].amount);
      }
    }


  }


}
