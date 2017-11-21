import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {SportType, Team} from "../../data-types/data-types.module";
import {Constants} from "../../util/constants";
import {MatDatepickerInputEvent, MatOptionSelectionChange} from "@angular/material";
import {TeamService} from "../../team-info/team.service";
import {Logger} from "@nsalaun/ng-logger";
import {GameService} from "../../game/game.service";

export class FilterEvent {
  public selectedSportType: SportType;
  public selectedTeam: Team;
  public selectedDate: Date;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit {
  //filter
  teams: Team[]
  filterData: FilterEvent = new FilterEvent()

  @Input()
  filterName: string
  @Output()
  findEvent: EventEmitter<FilterEvent> = new EventEmitter();
  @Output()
  resetEvent: EventEmitter<FilterEvent> = new EventEmitter();

  constructor(private teamService: TeamService, private logger: Logger, private gameService: GameService) {
  }

  ngOnInit() {
  }


//filter
  sportTypes(): Array<string> {
    return Constants.sportTypes;
  }


  sportTypeSelected($event: MatOptionSelectionChange, sportType: SportType) {
    if ($event.source.selected) {
      this.filterData.selectedSportType = sportType
      this.filterTeamsList(sportType)
    }
  }

  teamSelected($event: MatOptionSelectionChange, team: Team) {
    if ($event.source.selected) {
      this.filterData.selectedTeam = team
    }
  }

  filterTeamsList(sportType: SportType) {
    this.teamService.getTeams(sportType).then(rs => {
      this.teams = rs;

    }).catch(err => {
      this.logger.error(this.constructor.name, err)
    })
  }

  find() {
    //this.filterData.selectedSportType = SportType.Football
    this.findEvent.emit(this.filterData)
  }

  reset() {
    this.filterData.selectedSportType = null;
    this.teams = [];
    this.filterData.selectedTeam = null;
    this.resetEvent.emit();
  }

  getLogo(sportType: SportType): string {
    return this.gameService.getLogo(sportType)
  }

  changeGameDate($event: MatDatepickerInputEvent<Date>) {
    this.filterData.selectedDate = $event.value;

  }

}
