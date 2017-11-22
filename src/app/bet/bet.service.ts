import {Injectable} from '@angular/core';
import {Logger} from "@nsalaun/ng-logger";
import {Web3MetaService} from "../util/web3.service";
import {Bet, BetRate, MatPage, MyBet} from "../data-types/data-types.module";
import {NotificationService} from "../util/notification.service";
import {FilterEvent} from "../filter/filter/filter.component";
import {GameService} from "../game/game.service";

@Injectable()
export class BetService {
  sportBetContract: any

  constructor(private logger: Logger,
              private web3Meta: Web3MetaService,
              private notServ: NotificationService,
              private gameService: GameService) {
    this.web3Meta.sportBetContractSubjectO().subscribe((rs) => {
      this.sportBetContract = rs
    })
  }

  private getRandomDecimal(min, max) {
    return Math.random() * (max - min);
  }

  /**
   *
   * @param {string[]} gameIdExt
   * @returns {Promise<BetRate[]>} array with rates for each team, and draw bets
   */
  async getRate(gameIds: number[]): Promise<BetRate[]> {

    let rs = [];
    rs.push(new BetRate({
      teamIdExternal: "1",
      isDraw: false,
      rate: this.getRandomDecimal(1, 10)
    }))
    rs.push(new BetRate({
      teamIdExternal: "2",
      isDraw: false,
      rate: this.getRandomDecimal(1, 10)
    }))
    rs.push(new BetRate({
      isDraw: true,
      rate: this.getRandomDecimal(1, 10)
    }))


    return rs;

  }

  async makeBet(bet: Bet) {
    let tx = this.sportBetContract.bet(bet.game.id, bet.selectedTeam.id, bet.isDraw, {
      gas: 4465034
    }, (err, rs) => {
      if (err) {
        this.notServ.notifySimple("Failed to bet!", 5000)
        this.logger.error(this.constructor.name, "Failed to bet", err)
      } else {
        this.notServ.notifySimple("Bet Success TX: " + rs, 5000)
        this.logger.info(this.constructor.name, "Bet Success TX https://ropsten.etherscan.io/tx/" + rs)
      }
    })
  }

  //async getGames(filter: FilterEvent, page: MatPage): Promise<Game[]> {
  async getMyBets(filter: FilterEvent, page: MatPage): Promise<MyBet[]> {
    let games = await this.gameService.getGames(filter, page);

    let rs = [];
    for (let i = page.currentPage * page.pageSize; i < (page.currentPage * page.pageSize) + page.pageSize; i++) {
      let selectedGame = games[this.gameService.getRandomArbitrary(0, games.length - 1)];
      rs.push(new MyBet({
        game: selectedGame,
        rates: (await this.getRate([])),
        betTeam: this.gameService.getRandomArbitrary(-100, 100) % 2 == 0 ?
          selectedGame.teams[this.gameService.getRandomArbitrary(0, selectedGame.teams.length - 1)] :
          null,
        betAmount:
          this.gameService.getRandomArbitrary(100, 999999999999),
        winAmount: this.gameService.getRandomArbitrary(-100, 100)
      }))
    }


    return rs;

  }

}
