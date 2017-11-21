import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Web3MetaService} from "../../util/web3.service";
import {Logger} from "@nsalaun/ng-logger";
import {MatOptionSelectionChange} from "@angular/material";
import {Web3Account} from "../../data-types/data-types.module";

@Component({
  selector: 'app-bet-list',
  templateUrl: './bet-list.component.html',
  styleUrls: ['./bet-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BetListComponent implements OnInit {

  accounts: Web3Account[];
  accountsSubs: Subscription;

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
