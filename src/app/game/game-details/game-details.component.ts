import {Component, Input, ViewEncapsulation} from '@angular/core';
import {BetService} from "../../bet/bet.service";
import {GoogleCharts} from 'google-charts';
import {BetRate, ChartData, Game} from "../../data-types/data-types.module";

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameDetailsComponent {

  @Input()
  game: Game;
  rates: BetRate[];
  chartData: ChartData;


  constructor(private betService: BetService) {
    this.chartData = new ChartData()

  }

  ngOnInit() {

  }

  fillChartData() {
    this.rates.forEach(rate => {

      if (!rate.teamIdExternal) {
        this.chartData.data.push([
          "Draw",
          rate.rate
        ])
      } else {
        let team = this.game.getTeamByExternalId(rate.teamIdExternal)
        if (team) {
          this.chartData.data.push([
            team.teamName,
            rate.rate
          ])
        } else {
          console.error("Cant find team")
          console.dir(rate)
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
            },
            containerId: 'chart-' + this.game.externalId
          });
          wrapper.draw();

          /*  const pie_1_chart = new GoogleCharts.api.visualization
			  .PieChart(document.getElementById());
			pie_1_chart.draw(GoogleCharts.api.visualization.arrayToDataTable(this.chartData.data));*/
        });
      })
    }
  }

}
