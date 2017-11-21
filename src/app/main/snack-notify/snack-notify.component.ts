import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from "@angular/material";

@Component({
  selector: 'app-snack-notify',
  templateUrl: './snack-notify.component.html',
  styleUrls: ['./snack-notify.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SnackNotifyComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  ngOnInit() {
  }

}
