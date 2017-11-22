import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BetRate, ChartData, MyBet} from "../../data-types/data-types.module";
import {GoogleCharts} from 'google-charts';
import {logger} from "codelyzer/util/logger";
import {Logger} from "@nsalaun/ng-logger";

declare var google;

@Component({
  selector: 'app-bet-detail',
  templateUrl: './bet-detail.component.html',
  styleUrls: ['./bet-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BetDetailComponent implements OnInit {
  chartData: ChartData;
  @Input()
  myBet: MyBet

  constructor(private logger: Logger) {
    this.chartData = new ChartData()
  }

  ngOnInit() {
    if (this.myBet) {


/*   //charts works too slow, TODO: add game profile event on action

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
          containerId: 'chart-bet-' + this.myBet.game.externalId
        });
        wrapper.draw();

      });*/
    }
  }

  fillChartData() {
    this.myBet.rates.forEach(rate => {

      if (!rate.teamIdExternal) {
        this.chartData.data.push([
          "Draw (" + rate.rate + ")",
          rate.rate
        ])
      } else {
        let team = this.myBet.game.getTeamByExternalId(rate.teamIdExternal)
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

}
