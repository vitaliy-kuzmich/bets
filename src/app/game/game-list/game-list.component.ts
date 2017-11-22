import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {GameService} from "../game.service";
import {PageEvent} from "@angular/material";
import {Game, GameIterator, MatPage, Team} from "../../data-types/data-types.module";
import {FilterEvent} from "../../filter/filter/filter.component";

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameListComponent implements OnInit, OnDestroy {

  gameIterator: GameIterator;
  games: Game[];

  //filter
  teams: Team[]
  filterData: FilterEvent

  page: MatPage = new MatPage(null);


  constructor(private gameService: GameService) {
  }


  ngOnInit() {
  }

  pageChanged($event: PageEvent) {
    this.page.currentPage = $event.pageIndex
    this.page.pageSize = $event.pageSize
    this.page.currentLength = $event.length
    this.filterGamesList()
  }


  ngOnDestroy(): void {
    // this.gamesSub.unsubscribe()
  }


  filterGamesList() {
    this.gameService.getGames(this.filterData, this.page).then(rs => this.games = rs);
  }


}
