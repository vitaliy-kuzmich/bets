import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameListComponent} from "./game-list/game-list.component";
import {GameDetailsComponent} from "./game-details/game-details.component";
import {GameService} from "./game.service";
import {
  MatButtonModule,
  MatCardModule, MatDatepickerModule, MatExpansionModule, MatInputModule, MatPaginatorModule,
  MatSelectModule
} from "@angular/material";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {DataTypesModule} from "../data-types/data-types.module";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,

    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    DataTypesModule,
  ],
  declarations: [GameListComponent, GameDetailsComponent],
  providers: [GameService],
  exports: [GameListComponent]
})
export class GameModule {
}
