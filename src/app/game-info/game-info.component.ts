import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {GameService} from "../util/game.service";
import {Bet, Game, GameIterator, MatPage} from "../main/main-data-model";
import {Logger} from "@nsalaun/ng-logger";
import {Web3MetaService} from "../util/web3.service";
import {Subscription} from "rxjs/Subscription";
import {MatDialog, MatDialogConfig, PageEvent} from "@angular/material";
import {BetDialogComponent} from "../bet-dialog/bet-dialog.component";

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameInfoComponent implements OnInit, OnDestroy {

  gameIterator: GameIterator;
  games: Game[];
  loadSub: Subscription;
  gamesSub: Subscription;
  page: MatPage = new MatPage(null);

  constructor(public dialog: MatDialog, private gameService: GameService, private logger: Logger, private web3Meta: Web3MetaService) {

  }

  iteratorChanged() {
    this.gameService.iterateGames(this.gameIterator)
      .then(rs => this.games = rs)
      .catch(err => this.logger.error(err));

  }

  openDialog(game: Game): void {

    let bet = new Bet({
      game: game,
      amount: game.minBetAmount,
      selectedTeam: game.teams[0]
    })
    let cfg = new MatDialogConfig<Bet>();
    cfg.data = bet;
    cfg.width = '300px';
    let dialogRef = this.dialog.open(BetDialogComponent, cfg);

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.selectedTeam || result.isDraw)) {

        this.gameService.makeBet(result);

      }
    });
  }

  ngOnInit() {

    this.gameService.getGames().then(rs => this.games = rs);

    this.loadSub = this.web3Meta.afterLoadedO().subscribe(ready => {

      /*if (ready) {
        this.gameService.getGamesTotalLen().then(len => {
          this.logger.info(this.constructor.name, "Tot games len : ", len.valueOf())
          this.gameIterator = new GameIterator({
            startIndex: 0,
            sportType: SportType.Football,
            filterStartDateBefore: moment().add(30, "days").unix(),
            allowDraw: true,
            totalLen: len.valueOf()
          })

          this.iteratorChanged();

        }).catch(err => this.logger.error(err));
      }*/

    })

  }

  pageChanged($event: PageEvent) {
    console.dir($event)

  }

  ngOnDestroy(): void {
    // this.gamesSub.unsubscribe()
    this.loadSub.unsubscribe();
  }
}
