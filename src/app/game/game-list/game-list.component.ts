import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {GameService} from "../game.service";
import {Logger} from "@nsalaun/ng-logger";
import {Web3MetaService} from "../../util/web3.service";
import {
  MatDatepickerInputEvent,
  MatDialog,
  MatDialogConfig,
  MatOptionSelectionChange,
  PageEvent
} from "@angular/material";
import {BetDialogComponent} from "../../bet/bet-dialog/bet-dialog.component";
import {NotificationService} from "../../util/notification.service";
import {Constants} from "../../util/constants";
import {TeamService} from "../../team-info/team.service";
import {BetService} from "../../bet/bet.service";
import {Bet, Game, GameIterator, MatPage, SportType, Team} from "../../data-types/data-types.module";
import {FilterEvent} from "../../filter/filter/filter.component";

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameListComponent implements OnInit, OnDestroy {

  gameIterator: GameIterator;
  games: Game[];

  //filter
  teams: Team[]
  filterData: FilterEvent

  page: MatPage = new MatPage(null);


  constructor(public dialog: MatDialog,
              private gameService: GameService,
              private logger: Logger,
              private web3Meta: Web3MetaService,
              private notificationService: NotificationService,
              private teamService: TeamService,
              private betService: BetService) {


  }

  openDialog(game: Game): void {
    let bet = new Bet({
      game: game,
      amount: game.minBetAmount,
      selectedTeam: game.teams[0]
    })
    let cfg = new MatDialogConfig<Bet>();
    cfg.data = bet;
    let dialogRef = this.dialog.open(BetDialogComponent, cfg);

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.selectedTeam || result.isDraw)) {
        this.betService.makeBet(result);
      }
    });
  }

  ngOnInit() {
  }

  pageChanged($event: PageEvent) {
    this.page.currentPage = $event.pageIndex
    this.page.pageSize = $event.pageSize
    this.page.currentLength = $event.length
    this.filterGamesList()
  }


  ngOnDestroy(): void {
    // this.gamesSub.unsubscribe()
  }


  filterGamesList() {
    this.gameService.getGames(this.filterData, this.page).then(rs => this.games = rs);
  }


}
