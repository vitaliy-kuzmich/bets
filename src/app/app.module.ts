import {BrowserModule} from '@angular/platform-browser';
import {isDevMode, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {
  MatButtonModule,
  MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule, MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule, MatTabsModule,
  MatToolbarModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppHeaderComponent} from './app-header/app-header.component';
import {AddGameComponent} from './add-game/add-game.component';
import {GameInfoComponent} from './game-info/game-info.component';
import {AddTeamComponent} from './add-team/add-team.component';
import {TeamInfoComponent} from './team-info/team-info.component';
import {BetRateComponent} from './bet-rate/bet-rate.component';
import {Level, NgLoggerModule} from '@nsalaun/ng-logger';
import {BetService} from "./util/bet.service";
import {Web3MetaService} from "./util/web3.service";
import {GameService} from "./util/game.service";
import {TeamService} from "./util/team.service";
import {CommonModule} from "@angular/common";
import {BetDialogComponent} from './bet-dialog/bet-dialog.component';

const LOG_LEVEL = Level.LOG;
if (!isDevMode()) {
  const LOG_LEVEL = Level.ERROR;
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AppHeaderComponent,
    AddGameComponent,
    GameInfoComponent,
    AddTeamComponent,
    TeamInfoComponent,
    BetRateComponent,
    BetDialogComponent,

  ],
  imports: [
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

    NgLoggerModule.forRoot(LOG_LEVEL)
  ],
  entryComponents: [BetDialogComponent],
  providers: [
    Web3MetaService,
    GameService,
    TeamService,
    BetService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
