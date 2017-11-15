import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Bet, BetRate, Game} from "../main/main-data-model";
import {BetService} from "../util/bet.service";

@Component({
  selector: 'app-bet-rate',
  templateUrl: './bet-rate.component.html',
  styleUrls: ['./bet-rate.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BetRateComponent implements OnInit {

  @Input()
  game: Game;
  rates: BetRate[];


  constructor(private betService: BetService) {
  }

  ngOnInit() {
    if (this.game) {
      this.betService.getRate([this.game.id]).then(rs => {
        this.rates = rs;
      })
    }
  }

}
