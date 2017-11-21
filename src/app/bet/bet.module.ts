import {NgModule} from '@angular/core';16
import {CommonModule} from '@angular/common';
import {BetDialogComponent} from "./bet-dialog/bet-dialog.component";
import {BetListComponent} from "./bet-list/bet-list.component";
import {BetService} from "./bet.service";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {
  MatButtonModule,
  MatCheckboxModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatInputModule,
  MatSelectModule
} from "@angular/material";
import {DataTypesModule} from "../data-types/data-types.module";
import {FilterModule} from "../filter/filter.module";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    FilterModule,

    MatDialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,

    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    DataTypesModule,

  ],
  declarations: [BetDialogComponent, BetListComponent],
  entryComponents: [BetDialogComponent],
  providers: [BetService],
  exports: [BetListComponent, BetDialogComponent]
})
export class BetModule {
}
