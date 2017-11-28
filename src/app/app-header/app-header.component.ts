import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Web3MetaService} from "../util/web3.service";
import {Logger} from "@nsalaun/ng-logger";
import {Subscription} from "rxjs/Subscription";
import {Web3Account} from "../data-types/data-types.module";
import {LoadingService} from "../util/loading.service";

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppHeaderComponent implements OnInit {
  accounts: Web3Account[]
  accountsSubs: Subscription
  showQueryIndicator: boolean
  showGlobalLoader: boolean

  constructor(private web3: Web3MetaService,
              private logger: Logger,
              private loadingService: LoadingService) {
    loadingService.showQueryLoaderO().subscribe(rs => this.showQueryIndicator = rs)
    loadingService.showGlobalLoaderO().subscribe(rs => this.showGlobalLoader = rs)

  }

  ngOnInit() {
    this.web3.accountsSubjectO().subscribe((accs: Web3Account[]) => {
      this.accounts = accs;
    });
  }

}
