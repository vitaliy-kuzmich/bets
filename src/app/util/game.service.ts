import {Injectable} from '@angular/core';
import {Logger} from '@nsalaun/ng-logger';
import {Bet, Game, GameIterator, SportType, Web3Account} from "../main/main-data-model";
import {Web3MetaService} from "./web3.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import * as moment from "moment";
import {TeamService} from "./team.service";

@Injectable()
export class GameService {
  sportBetContract: any
  private gamesIterSub: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);
  private web3Native: any;

  private accs: Web3Account[]


  constructor(private logger: Logger, private web3Meta: Web3MetaService, private teamService: TeamService) {
    this.logger.info(this.constructor.name, " subscribing for contract :")
    this.web3Meta.sportBetContractSubjectO().subscribe((rs) => {
      this.sportBetContract = rs
      this.logger.info(this.constructor.name, " contract initialized")
    })
    this.web3Meta.web3SubjectO().subscribe((rs) => {
      this.web3Native = rs
    })
    this.web3Meta.accountsSubjectO().subscribe(rs => {
      this.accs = rs
    })
  }

  //TODO: move this code to the backend
  async getGamesTotalLen() {
    //this.logger.info("Total games length :", len.valueOf())

    return await this.sportBetContract.getGamesLen.call();
  }

  String2Hex(tmp) {
    var str = '';
    for (var i = 0; i < tmp.length; i++) {
      str += tmp[i].charCodeAt(0).toString(16);
    }
    return str;
  }

  //TODO: move this code to the backend
  async iterateGames(iter: GameIterator): Promise<Game[]> {
    let rawResult = await this.sportBetContract.iterateGames.call(iter.startIndex,
      iter.sportType, iter.filterStartDateBefore, iter.allowDraw);
    console.dir(rawResult)
    if (rawResult[0].length > 0) {
      return <Game[]> rawResult.map(gam => {
        return new Game({
          id: gam[0].valueOf(),
          startDate: gam[1].valueOf(),
          description: this.web3Meta.toAscii(gam[2])
        });
      });
    } else {
      this.logger.warn(this.constructor.name, " list empty")
      return []
    }
  }

  //TODO: replace mock data with data from server
  async getGames(): Promise<Game[]> {
    let tms = await this.teamService.getTeams(SportType.Football)
    return [new Game({
      id: 1,
      teamIds: [tms[0].id, tms[1].id],
      bets: [],
      teams: [tms[0], tms[1]],
      externalId: "1",
      //mapping (uint :> Bet[]) bets,

      //game status
      drawBets: [],
      payoutLock: false,
      wasRefund: false,
      //end game status

      startDate: moment().add(1, "days"),
      endDate: moment().add(1, "days").add(1, "hours"),

      description: "Playing at home at Arsenal team",
      sportType: SportType.Football,

      minBetAmount: 100,
      allowDrawBets: true,
    }),
      new Game({
        // means it does not exists in the blockchain
        id: 2,
        teamIds: [tms[1].id, tms[0].id],
        externalId: "2",
        bets: [],
        teams: [tms[1], tms[0]],
        //mapping (uint :> Bet[]) bets,

        //game status
        drawBets:
          [],
        payoutLock:
          false,
        wasRefund:
          false,
        //end game status

        startDate:
          moment().add(2, "days"),
        endDate:
          moment().add(2, "days").add(1, "hours"),

        description:
          "Playing at home at Dnipro team",
        sportType:
        SportType.Football,

        minBetAmount:
          200,
        allowDrawBets:
          true,
      }),
    ]
  }

  addGame(game: Game) {

    let result = this.sportBetContract.addGame.sendTransaction(this.String2Hex(game.sportType), [game.teams[0].id, game.teams[1].id],
      game.startDate, game.endDate, game.allowDrawBets, game.minBetAmount, this.String2Hex(game.description),this.String2Hex( game.externalId),
      {
        gas: 6712390,
        from: this.accs[0].address
      }).then(rs => {
      this.logger.debug(this.constructor.name, "game added ok")
    }).catch(err => {
      this.logger.error(this.constructor.name, "Can't add new game match")
      this.logger.error(err)
    })
    this.logger.info(this.constructor.name, "Add new game match TX " + result)

  }

  async getGame(externalId: string): Promise<Game> {
    return ((await this.getGames()).filter(g => g.externalId == externalId))[0]
  }


  async makeBet(bet: Bet) {
    // bet(uint _gameId, uint _teamId, bool _isDraw)
    let tx = this.sportBetContract.bet.sendTransaction(bet.game.id, bet.selectedTeam.id, bet.isDraw).then(tx => {
      this.logger.info(this.constructor.name, " Bet sent to the network team:", bet.selectedTeam.teamName, tx)

    }).catch(err => {
      this.logger.error(this.constructor.name, " Can't create bet for team : ", bet.selectedTeam.teamName)
    });


  }
}
