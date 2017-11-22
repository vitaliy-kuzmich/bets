import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Web3MetaService} from "../../util/web3.service";
import {Logger} from "@nsalaun/ng-logger";
import {MatOptionSelectionChange, PageEvent} from "@angular/material";
import {MatPage, MyBet, Web3Account} from "../../data-types/data-types.module";
import {FilterEvent} from "../../filter/filter/filter.component";
import {BetService} from "../bet.service";

@Component({
  selector: 'app-bet-list',
  templateUrl: './bet-list.component.html',
  styleUrls: ['./bet-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BetListComponent implements OnInit {

  accounts: Web3Account[];
  accountsSubs: Subscription;
  bets: MyBet[]

  filterData: FilterEvent;
  page: MatPage = new MatPage(null);

  constructor(private web3: Web3MetaService,
              private logger: Logger,
              private betService: BetService) {
    this.bets = []
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

  filterBets(filter: FilterEvent) {
    this.filterData = filter;
    this.filterMyBets()
  }

  pageChanged($event: PageEvent) {
    this.page.currentPage = $event.pageIndex
    this.page.pageSize = $event.pageSize
    this.page.currentLength = $event.length
    this.filterMyBets()
  }

  filterMyBets() {
    this.betService.getMyBets(this.filterData, this.page)
      .then(rs => this.bets = rs)
      .catch(err => this.logger.error(this.constructor.name, "Failed to fetch my bets ", err))
  }


}
