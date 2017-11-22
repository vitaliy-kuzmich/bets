import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddTeamComponent} from "./add-team/add-team.component";
import {AddGameComponent} from "./add-game/add-game.component";
import {DataTypesModule} from "../data-types/data-types.module";
import {
  MatButtonModule, MatCardModule, MatDatepickerModule, MatGridListModule, MatInputModule,
  MatSelectModule
} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  imports: [
    CommonModule,
    DataTypesModule,
    BrowserModule,
    FormsModule,

    MatCardModule,
    DataTypesModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  declarations: [AddTeamComponent, AddGameComponent],
})
export class AdminModule {
}
