import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BetDialogComponent} from "./bet-dialog/bet-dialog.component";
import {BetListComponent} from "./bet-list/bet-list.component";
import {BetService} from "./bet.service";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {
  MatButtonModule, MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule, MatGridListModule,
  MatInputModule, MatPaginatorModule,
  MatSelectModule
} from "@angular/material";
import {DataTypesModule} from "../data-types/data-types.module";
import {FilterModule} from "../filter/filter.module";
import { BetDetailComponent } from './bet-detail/bet-detail.component';

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
    MatPaginatorModule,
    MatGridListModule,
    MatCardModule,

    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    DataTypesModule,

  ],
  declarations: [BetDialogComponent, BetListComponent, BetDetailComponent],
  entryComponents: [BetDialogComponent],
  providers: [BetService],
  exports: [BetListComponent, BetDialogComponent]
})
export class BetModule {
}
