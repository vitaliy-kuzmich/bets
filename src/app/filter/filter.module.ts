import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterComponent} from './filter/filter.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatInputModule,
  MatPaginatorModule,
  MatSelectModule
} from "@angular/material";
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
  declarations: [FilterComponent],
  exports: [FilterComponent]
})
export class FilterModule {
}
