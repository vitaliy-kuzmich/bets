import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

export class ChartData {
  public data: any[] = [["Name", "Rate"]];
}

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
    if (options != null) {
      this.pageSize = options.pageSize
      this.currentLength = options.currentLength
      this.currentPage = options.currentPage
    }
  }

  currentPage: number = 0
  currentLength: number = 50;
  pageSize: number = 10;
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
    this.sportType = opt.selectedSportType
    this.externalId = opt.externalId
    this.iconUrl = opt.iconUrl
  }

  id: number;
  teamName: number;
  description: string
  sportType: SportType
  externalId: string
  iconUrl: string
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
    this.sportType = opt.selectedSportType;

    this.minBetAmount = opt.minBetAmount;
    this.allowDrawBets = opt.allowDrawBets;
    this.externalId = opt.externalId;
    this.teams = opt.teams;
    this.logoUrl = opt.logoUrl
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
  logoUrl: string;

  getTeamByExternalId(extId: string): Team {
    let rs = null
    for (let i = 0; i < this.teams.length; i++) {
      if (this.teams[i].externalId.localeCompare(extId)) {
        rs = this.teams[i]
        break;
      }
    }

    return rs;
  }
}

export class GameIterator {
  constructor(opt: any) {
    this.startIndex = opt.startIndex
    this.sportType = opt.selectedSportType
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

export class MyBet {
  constructor(options: any) {
    this.game = options.game
    this.rates = options.rates
    this.betTeam = options.betTeam
    this.betAmount = options.betAmount
    this.winAmount = options.winAmount
  }

  game: Game
  rates: BetRate[]
  betTeam: Team
  betAmount: number
  winAmount: number
}


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  // exports: [SportType, ChartData, GameIterator, Game, Team, Bet, Web3Account, MatPage, BetRate]
})
export class DataTypesModule {
}
