import {Injectable} from '@angular/core';
import {Logger} from "@nsalaun/ng-logger";
import {Web3MetaService} from "../util/web3.service";
import {Bet, BetRate} from "../data-types/data-types.module";
import {NotificationService} from "../util/notification.service";

@Injectable()
export class BetService {
  sportBetContract: any

  constructor(private logger: Logger, private web3Meta: Web3MetaService, private notServ: NotificationService) {
    this.web3Meta.sportBetContractSubjectO().subscribe((rs) => {
      this.sportBetContract = rs
    })
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
      rate: 0.23
    }))
    rs.push(new BetRate({
      teamIdExternal: "2",
      isDraw: false,
      rate: 2.6565
    }))
    rs.push(new BetRate({
      isDraw: true,
      rate: 3.6565
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

}
