import {BrowserModule} from '@angular/platform-browser';
import {isDevMode, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppHeaderComponent} from './app-header/app-header.component';
import {Level, NgLoggerModule} from '@nsalaun/ng-logger';
import {Web3MetaService} from "./util/web3.service";
import {CommonModule} from "@angular/common";
import {TeamInfoComponent} from "./team-info/team-info.component";
import {SnackNotifyComponent} from "./main/snack-notify/snack-notify.component";
import {SnackErrorComponent} from "./main/snack-error/snack-error.component";
import {TeamService} from "./team-info/team.service";
import {NotificationService} from "./util/notification.service";
import {BetModule} from "./bet/bet.module";
import {GameModule} from "./game/game.module";
import {AppFooterComponent} from './app-footer/app-footer.component';
import {DataTypesModule} from "./data-types/data-types.module";

const LOG_LEVEL = Level.LOG;
if (!isDevMode()) {
  const LOG_LEVEL = Level.ERROR;
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AppHeaderComponent,
    TeamInfoComponent,
    SnackNotifyComponent,
    SnackErrorComponent,
    AppFooterComponent,

  ],
  imports: [
    MatSnackBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatRadioModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,

    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule,
    BrowserAnimationsModule,
    BetModule,
    GameModule,
    DataTypesModule,
    //AdminModule,

    NgLoggerModule.forRoot(LOG_LEVEL)
  ],
  entryComponents: [SnackNotifyComponent, SnackErrorComponent],
  providers: [
    NotificationService,
    Web3MetaService,
    TeamService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
