import {Component, OnDestroy, OnInit} from '@angular/core';
import {Web3MetaService} from "../util/web3.service";
import {MatOptionSelectionChange} from "@angular/material";
import {Subscription} from "rxjs/Subscription";
import {Logger} from "@nsalaun/ng-logger";
import {Web3Account} from "../data-types/data-types.module";
import {Constants} from "../util/constants";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  accounts: Web3Account[];
  accountsSubs: Subscription;
  contractAddress: string = Constants.sportBetsAddress

  constructor(private web3: Web3MetaService, private logger: Logger) {
  }

  ngOnInit() {
    this.web3.accountsSubjectO().subscribe((accs: Web3Account[]) => {
      this.accounts = accs;
    });
  }

  changedAccount($event: MatOptionSelectionChange, account: Web3Account) {
    if ($event.source.selected) {
      console.dir(account);
    }
  }


  ngOnDestroy(): void {
    this.accountsSubs.unsubscribe();
  }

}
