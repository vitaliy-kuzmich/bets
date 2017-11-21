import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {TeamService} from "./team.service";
import {Logger} from "@nsalaun/ng-logger";
import {Subscription} from "rxjs/Subscription";
import {SportType, Team} from "../data-types/data-types.module";

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TeamInfoComponent implements OnInit, OnDestroy {
  sportTypeFilter: SportType
  teams: Team[]

  constructor(private teamService: TeamService, private logger: Logger) {
    this.sportTypeFilter = SportType.Football
    this.teams = []

  }

  ngOnInit() {
     this.teamService.getTeams(this.sportTypeFilter).then(rs => this.teams = rs);
  }

  ngOnDestroy(): void {
  }

}
