import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Web3MetaService} from "../util/web3.service";
import {Logger} from "@nsalaun/ng-logger";
import {Subscription} from "rxjs/Subscription";
import {Web3Account} from "../data-types/data-types.module";

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppHeaderComponent implements OnInit {
  accounts: Web3Account[];
  accountsSubs: Subscription;

  constructor(private web3: Web3MetaService, private logger: Logger) {

  }

  ngOnInit() {
    this.web3.accountsSubjectO().subscribe((accs: Web3Account[]) => {
      this.accounts = accs;
    });
  }

}
