import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatOptionSelectionChange} from "@angular/material";
import {Bet, Team} from "../../data-types/data-types.module";

@Component({
  selector: 'app-bet-dialog',
  templateUrl: './bet-dialog.component.html',
  styleUrls: ['./bet-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BetDialogComponent implements OnInit {

  localBet: Bet;

  constructor(public dialogRef: MatDialogRef<BetDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public bet: Bet) {
    this.localBet = bet;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changedTeam($event: MatOptionSelectionChange, team: Team) {
    if ($event.source.selected) {
      this.localBet.selectedTeam = team;
    }

  }
}
