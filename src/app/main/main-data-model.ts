export class BetRate {
  constructor(options: any) {
    this.teamId = options.teamId
    this.isDraw = options.isDraw
    this.rate = options.rate
    this.teamIdExternal = options.teamIdExternal
  }

  teamId: number
  teamIdExternal: string
  isDraw: boolean
  rate: number
}

export class MatPage {

  constructor(options: any) {
    if (options) {
      this.pageSize = options.pageSize
      this.length = options.length
      this.pageSizeOptions = options.pageSizeOptions
    }
  }

  length: number = 100;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
}

export class Web3Account {
  constructor(options: any) {

    this.address = options.address;
    this.balance = options.balance;
  }

  address: string;
  balance: number;
}

export class Bet {
  constructor(opt: any) {
    this.amount = opt.amount;
    this.addr = opt.addr;
    this.game = opt.game;
    this.selectedTeam = opt.selectedTeam;
    this.isDraw = opt.isDraw
  }

  addr: string;
  amount: number;
  game: Game;
  selectedTeam: Team;
  isDraw: boolean;
}

export class Team {

  constructor(opt: any) {
    this.id = opt.id
    this.teamName = opt.teamName
    this.description = opt.description
    this.sportType = opt.sportType
    this.externalId = opt.externalId
  }

  id: number;
  teamName: number;
  description: string
  sportType: SportType
  externalId: string
}

export class Game {

  constructor(opt: any) {
    this.id = opt.id;
    this.teamIds = opt.teamIds;
    this.bets = opt.bets
    //mapping (uint => Bet[]) bets;

    //game status
    this.drawBets = opt.drawBets;
    this.payoutLock = opt.payoutLock;
    this.wasRefund = opt.wasRefund;
    //end game status

    this.startDate = opt.startDate;
    this.endDate = opt.endDate;

    this.description = opt.description;
    this.sportType = opt.sportType;

    this.minBetAmount = opt.minBetAmount;
    this.allowDrawBets = opt.allowDrawBets;
    this.externalId = opt.externalId;
    this.teams = opt.teams;
  }

  id: number;
  externalId: string;
  teamIds: number[];
  bets: any
  teams: Team[];
  //mapping (uint => Bet[]) bets;

  //game status
  drawBets: Bet[];
  payoutLock: boolean;
  wasRefund: boolean;
  //end game status

  startDate: number;
  endDate: number;

  description: string;
  sportType: SportType;

  minBetAmount: number;
  allowDrawBets: boolean;
}

export class GameIterator {
  constructor(opt: any) {
    this.startIndex = opt.startIndex
    this.sportType = opt.sportType
    this.filterStartDateBefore = opt.filterStartDateBefore
    this.allowDraw = opt.allowDraw
    this.totalLen = opt.totalLen
  }

  startIndex: number
  sportType: string
  filterStartDateBefore: number
  allowDraw: boolean
  totalLen: number
}

export enum SportType {
  Football = "Football",
  NFL = "NFL",
  NCAAF = "NCAAF",
  NCAAB = "NCAAB",
  NBA = "NBA",
  MLB = "MLB",
  NHL = "NHL",
  Tennis = "Tennis",
  WNBA = "WNBA",
  MMA = "MMA",
  KHL = "KHL",
  AHL = "AHL",
  SHL = "SHL",
  HockeyAllsvenskan = "HockeyAllsvenskan"
}

