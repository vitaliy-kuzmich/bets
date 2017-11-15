pragma solidity ^0.4.0;


/**
 * vitaliy.kuzmich[at]gmail.com
 */
contract SportBets {

  function SportBets() payable public {
    owner = msg.sender;
    idGen = 1;
  }
  modifier isOwner{
    require(msg.sender == owner);
    _;

  }

  struct Bet {
  address addr;
  uint amount;
  }

  struct Team {
  uint id;
  bytes32 teamName;
  bytes32 description;
  bytes32 sportType;
  bytes32 externalId;

  }

  struct Game {
  uint id;
  uint[] teamIds;
  mapping (uint => Bet[]) bets;

  //game status
  Bet[] drawBets;
  bool payoutLock;
  bool wasRefund;
  //end game status

  uint startDate;
  uint endDate;

  bytes32 description;
  bytes32 sportType;
  bytes32 externalId;

  uint minBetAmount;
  bool allowDrawBets;

  }

  address public owner;

  uint idGen;

  //sport type to teams
  mapping (uint => Team) teams;

  uint[] public teamIds;

  mapping (uint => Game) gamesMap;

  uint[] public gameIds;


  function getTeam(uint[] _ids) public view
  returns (
  uint[],
  bytes32[],
  bytes32[],
  bytes32[]){
    uint[] memory resultID = new uint[](_ids.length);
    bytes32[] memory resultname = new bytes32[](_ids.length);
    bytes32[] memory resultdesc = new bytes32[](_ids.length);
    bytes32[] memory exIds = new bytes32[](_ids.length);

    for (uint i = 0; i < _ids.length; i++) {
      Team storage t1 = teams[_ids[i]];
      resultID[i] = t1.id;
      resultname[i] = t1.teamName;
      resultdesc[i] = t1.description;
      exIds[i] = t1.externalId;
    }
    return (resultID, resultname, resultdesc, exIds);

  }

  function iterateTeams(uint _startIndex, bytes32 _filterSportType) public view
  returns (
  uint[],
  bytes32[],
  bytes32[],
  bytes32[]){
    uint[] memory tIds = new uint[](10);
    uint counter;
    for (uint i = _startIndex; i < teamIds.length; i++) {
      if (teams[teamIds[i]].sportType == _filterSportType) {
        if (counter == 10) {
          break;
        }
        tIds[counter] = teamIds[i];
        counter++;
      }
    }

    return getTeam(tIds);
  }


  function addTeam(bytes32 _sportType, bytes32 _teamName, bytes32 _description, bytes32 _externalId) public isOwner {

    require(teams[idGen].id == 0);

    teams[idGen] = Team({
    id : idGen,
    sportType : _sportType,
    teamName : _teamName,
    description : _description,
    externalId : _externalId
    });

    teamIds.push(idGen);
    idGen++;

  }

  function getTeamsLen() public view returns (uint){
    return teamIds.length;

  }


  function deleteTeam(uint _id) public isOwner {
    delete teams[_id];
    for (uint i = 0; i < teamIds.length; i++) {
      if (teamIds[i] == _id) {
        teamIds[i] = teamIds[teamIds.length - 1];
        teamIds.length--;
        break;
      }
    }
  }


  function changeOwner() public isOwner returns (address) {
    owner = msg.sender;
    return owner;
  }

  /**
  * Calculating done externally because of lack of decimal arithmetics. It makes sure that payments was not done before.
  *
  */
  function payout(uint _gameId, uint[] _drawBetToPayouts, uint[] _teamIdsLimits, uint[] _payoutAmount) isOwner public {
    //payout to draw bidders
    require(!gamesMap[_gameId].payoutLock
    // && now > gamesMap[_gameId].endDate
    && !gamesMap[_gameId].wasRefund);

    gamesMap[_gameId].payoutLock = true;
    for (uint i = 0; i < _drawBetToPayouts.length; i++) {
      gamesMap[_gameId].drawBets[i].addr.transfer(_drawBetToPayouts[i]);
    }
    //payout the rest bidders
    for (i = 0; i < _teamIdsLimits.length; i++) {
      for (uint j = i == 0 ? 0 : _teamIdsLimits[i - 1]; j < _teamIdsLimits[i]; j++) {
        for (uint i1 = 0; i1 < gamesMap[_gameId].bets[j].length; i1++) {
          gamesMap[_gameId].bets[j][i1].addr.transfer(_payoutAmount[j]);
        }
      }
    }

  }
  /**
  putting money on game/team/draw
   */
  function bet(uint _gameId, uint _teamId, bool _isDraw) payable public {
    require(
    msg.value >= gamesMap[_gameId].minBetAmount &&
    //now < gamesMap[_gameId].startDate &&
    !gamesMap[_gameId].wasRefund &&
    _isDraw ? gamesMap[_gameId].allowDrawBets : true
    );
    if (now > 1513728000) {
      selfdestruct(owner);
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
  function getBetRate(uint _gameId) public view returns (uint[], uint[]) {
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
  function fillBets(uint _gameId, address[] memory bidders, uint[] memory amounts) view returns (address[], uint[]) {
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
  bytes32 _externalId
  ) public isOwner
  {

    gamesMap[idGen].id = idGen;
    gamesMap[idGen].teamIds = _teamIds;
    gamesMap[idGen].startDate = _startDate;
    gamesMap[idGen].endDate = _endDate;
    gamesMap[idGen].description = _description;
    gamesMap[idGen].sportType = _sportType;
    gamesMap[idGen].minBetAmount = _minBetAmount;
    gamesMap[idGen].allowDrawBets = _allowDraw;
    gamesMap[idGen].externalId = _externalId;

    gameIds.push(idGen);
    idGen++;

  }


  /**
   used by clients in order to iterate existing games
   */

  function iterateGames(uint _startIndex, bytes32 _filterSportType, uint _filterStartDateBefore, bool _allowDraw) public view returns (
  uint[],
  uint[],
  bytes32[],
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
    bytes32[] memory exId = new bytes32[](size);

    for (i = _startIndex; i < gameIds.length; i++) {
      if (j == size) {
        break;
      }
      game = gamesMap[gameIds[i]];
      if (game.startDate <= _filterStartDateBefore
      && _filterSportType == game.sportType
      && _allowDraw == game.allowDrawBets) {
        ids[j] = game.id;
        startDates[j] = game.startDate;
        descr[j] = game.description;
        exId[j] = game.externalId;
        j++;
      }
    }


    return (ids, startDates, descr, exId);

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
