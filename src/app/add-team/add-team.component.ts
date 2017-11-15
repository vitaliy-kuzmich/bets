import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SportType, Team} from "../main/main-data-model";
import {Logger} from "@nsalaun/ng-logger";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material";
import {TeamService} from "../util/team.service";


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddTeamComponent {

  constructor(private logger: Logger, private teamService: TeamService) {
  }

  addNewTeam(name: string, descr: string, externalId: string, sportType: SportType) {
    this.teamService.addNewTeam(new Team({
      teamName: name,
      externalId: externalId,
      description: descr,
      sportType: sportType
    })).then(rs => {
      this.logger.debug(this.constructor.name, "team added ok")
    }).catch(err => {
      this.logger.error(this.constructor.name, "Can't add new team")
      this.logger.error(err)
    })

  }

  sportTypes(): Array<string> {
    return Object.keys(SportType);
  }

}
