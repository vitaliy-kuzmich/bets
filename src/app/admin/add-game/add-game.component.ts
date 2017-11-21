import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Logger} from "@nsalaun/ng-logger";
import {GameService} from "../../game/game.service";
import {Game, SportType} from "../../data-types/data-types.module";

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddGameComponent implements OnInit {

  constructor(private logger: Logger, private gameService: GameService) {
  }

  ngOnInit() {
  }

  /**
   * create match at the blockchain in order to allow bet to it
   * @param {Game} game
   */
  addGame(_startDate: number, endDate: number, _descr: string, teamIds: number[]) {
    this.gameService.addGame(new Game({
      externalId: "1r1r",
      teamIds: teamIds,
      startDate: _startDate,
      endDate: endDate,
      description: _descr,
      sportType: SportType.Football,
      minBetAmount: 100,
      allowDrawBets: true,
    }))//.catch(err => this.logger.error(this.constructor.name, " was not able to create new game ", err))


  }

  sportTypes(): Array<string> {
    return Object.keys(SportType);
  }
}
