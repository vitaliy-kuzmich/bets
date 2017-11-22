import {Component, Input, ViewEncapsulation} from '@angular/core';
import {BetService} from "../../bet/bet.service";
import {GoogleCharts} from 'google-charts';
import {Bet, BetRate, ChartData, Game} from "../../data-types/data-types.module";
import {BetDialogComponent} from "../../bet/bet-dialog/bet-dialog.component";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {Logger} from "@nsalaun/ng-logger";

declare var google;

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css',],
  encapsulation: ViewEncapsulation.None
})
export class GameDetailsComponent {

  @Input()
  game: Game;
  rates: BetRate[];
  chartData: ChartData;

  constructor(private betService: BetService,
              public dialog: MatDialog,
              private logger: Logger) {
    this.chartData = new ChartData()
  }

  ngOnInit() {
  }

  fillChartData() {
    this.rates.forEach(rate => {

      if (!rate.teamIdExternal) {
        this.chartData.data.push([
          "Draw (" + rate.rate + ")",
          rate.rate
        ])
      } else {
        let team = this.game.getTeamByExternalId(rate.teamIdExternal)
        if (team) {
          this.chartData.data.push([
            team.teamName + " (" + rate.rate + ")",
            rate.rate
          ])
        } else {
          this.logger.error(this.constructor.name, "Cant load Team")
        }
      }
    })

  }

  panelOpened() {
    if (this.game && !this.rates) {
      this.betService.getRate([this.game.id]).then(rs => {
        this.rates = rs;
        this.fillChartData()

        GoogleCharts.load(() => {

          let wrapper = new google.visualization.ChartWrapper({
            chartType: "PieChart",
            dataTable: GoogleCharts.api.visualization.arrayToDataTable(this.chartData.data),
            options: {
              width: 400, height: 200,
              chartArea: {width: '90%', height: '80%'},
              titlePosition: 'in', axisTitlesPosition: 'in',
              hAxis: {showTextEvery: '1', textPosition: 'out'},
              vAxis: {textPosition: 'out'},
              legend: {position: 'right', textStyle: {fontSize: '18'}},
              tooltip: {textStyle: {fontSize: '16'}},
              backgroundColor: "#e3daff",
            },
            containerId: 'chart-' + this.game.externalId
          });
          wrapper.draw();

        });
      })
    }
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

}
