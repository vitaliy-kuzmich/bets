import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameListComponent} from "./game-list/game-list.component";
import {GameDetailsComponent} from "./game-details/game-details.component";
import {GameService} from "./game.service";
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule, MatGridListModule,
  MatPaginatorModule,
  MatTooltipModule
} from "@angular/material";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {DataTypesModule} from "../data-types/data-types.module";
import {FilterModule} from "../filter/filter.module";

@NgModule({
  imports: [
    FilterModule,
    CommonModule,
    BrowserModule,
    FormsModule,

    MatCardModule,
    MatPaginatorModule,
    MatExpansionModule,
    DataTypesModule,
    MatButtonModule,
    MatTooltipModule,
    MatGridListModule
  ],
  declarations: [GameListComponent, GameDetailsComponent],
  providers: [GameService],
  exports: [GameListComponent]
})
export class GameModule {
}
