import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddTeamComponent} from "./add-team/add-team.component";
import {AddGameComponent} from "./add-game/add-game.component";
import {DataTypesModule} from "../data-types/data-types.module";

@NgModule({
  imports: [
    CommonModule,
    DataTypesModule,
  ],
  declarations: [AddTeamComponent, AddGameComponent],
})
export class AdminModule { }
