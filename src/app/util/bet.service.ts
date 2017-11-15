import {Injectable} from '@angular/core';
import {Bet, BetRate} from "../main/main-data-model";

@Injectable()
export class BetService {

  constructor() {
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

}
