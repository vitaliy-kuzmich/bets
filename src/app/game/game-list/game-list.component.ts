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
  selectedSportType: SportType;
  selectedTeam: Team;
  page: MatPage = new MatPage(null);
  gameDate: Date;

  constructor(public dialog: MatDialog,
              private gameService: GameService,
              private logger: Logger,
              private web3Meta: Web3MetaService,
              private notificationService: NotificationService,
              private teamService: TeamService,
              private betService: BetService) {


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
    let dialogRef = this.dialog.open(BetDialogComponent, cfg);

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.selectedTeam || result.isDraw)) {
        this.betService.makeBet(result);
      }
    });
  }

  ngOnInit() {
    this.selectedSportType = SportType.Football
    this.filterTeamsList()

  }

  pageChanged($event: PageEvent) {
    this.page.currentPage = $event.pageIndex
    this.page.pageSize = $event.pageSize
    this.page.currentLength = $event.length
    this.filterGamesList()

  }

  changeGameDate($event: MatDatepickerInputEvent<Date>) {
    this.gameDate = $event.value;
    this.filterGamesList()
  }

  teamSelected($event: MatOptionSelectionChange, team: Team) {
    if ($event.source.selected) {
      this.selectedTeam = team
      if (this.selectedTeam.id < 0) {
        this.selectedTeam = null
      }
      this.filterGamesList()
    }
  }

  sportTypes(): Array<string> {
    return Constants.sportTypes;
  }

  sportTypeSelected($event: MatOptionSelectionChange, sportType: SportType) {
    if ($event.source.selected) {
      this.selectedSportType = sportType
      this.filterTeamsList()
    }
  }

  ngOnDestroy(): void {
    // this.gamesSub.unsubscribe()
  }

  filterTeamsList() {
    this.teamService.getTeams(this.selectedSportType).then(rs => {
      this.teams = [new Team({id: -1, teamName: "None"})]
      this.teams = this.teams.concat(rs);
      this.filterGamesList()

    }).catch(err => {
      this.logger.error(this.constructor.name, err)
    })
  }

  filterGamesList() {
    this.gameService.getGames(this.selectedSportType, this.page, this.selectedTeam, this.gameDate).then(rs => this.games = rs);
  }

  getLogo(sportType: SportType): string {
    return this.gameService.getLogo(sportType)
  }
}
