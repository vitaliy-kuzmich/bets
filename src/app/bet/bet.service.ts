import {Injectable} from '@angular/core';
import {Logger} from "@nsalaun/ng-logger";
import {Web3MetaService} from "../util/web3.service";
import {Bet, BetRate} from "../data-types/data-types.module";

@Injectable()
export class BetService {
  sportBetContract: any

  constructor(private logger: Logger, private web3Meta: Web3MetaService) {
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
    // bet(uint _gameId, uint _teamId, bool _isDraw)
    let tx = this.sportBetContract.bet.sendTransaction(bet.game.id, bet.selectedTeam.id, bet.isDraw).then(tx => {
      this.logger.info(this.constructor.name, " Bet sent to the network team:", bet.selectedTeam.teamName, tx)

    }).catch(err => {
      this.logger.error(this.constructor.name, " Can't create bet for team : ", bet.selectedTeam.teamName)
    });
  }

}
