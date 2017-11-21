import {Injectable} from '@angular/core';
import {Logger} from '@nsalaun/ng-logger';
import {Web3MetaService} from "../util/web3.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import * as moment from "moment";
import {TeamService} from "../team-info/team.service";
import Web3 from 'web3';
import {Game, GameIterator, MatPage, SportType, Team, Web3Account} from '../data-types/data-types.module';

@Injectable()
export class GameService {
  sportBetContract: any
  private accs: Web3Account[]
  private web3: Web3;


  constructor(private logger: Logger, private web3Meta: Web3MetaService, private teamService: TeamService) {
    this.web3Meta.sportBetContractSubjectO().subscribe((rs) => {
      this.sportBetContract = rs
    })
    this.web3Meta.accountsSubjectO().subscribe(rs => {
      this.accs = rs
    })
    this.web3Meta.web3SubjectO().subscribe(rs => {
      this.web3 = rs
    })
  }

  //TODO: move this code to the backend
  async getGamesTotalLen() {
    //this.logger.info("Total games length :", len.valueOf())

    return await this.sportBetContract.getGamesLen.call();
  }

  String2Hex(tmp) {
    var str = '';
    for (var i = 0; i < tmp.length; i++) {
      str += tmp[i].charCodeAt(0).toString(16);
    }
    return str;
  }

  //TODO: move this code to the backend
  async iterateGames(iter: GameIterator): Promise<Game[]> {
    let rawResult = await this.sportBetContract.iterateGames.call(iter.startIndex,
      iter.sportType, iter.filterStartDateBefore, iter.allowDraw);
    console.dir(rawResult)
    if (rawResult[0].length > 0) {
      return <Game[]> rawResult.map(gam => {
        return new Game({
          id: gam[0].valueOf(),
          startDate: gam[1].valueOf(),
          description: this.web3Meta.toAscii(gam[2])
        });
      });
    } else {
      this.logger.warn(this.constructor.name, " list empty")
      return []
    }
  }

  private getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //TODO: replace mock data with data from server
  async getGames(sportType: SportType, page: MatPage, team?: Team, gameDate?: Date): Promise<Game[]> {
    let tms = await this.teamService.getTeams(sportType);
    let rs = [];
    for (let i = page.currentPage * page.pageSize; i < (page.currentPage * page.pageSize) + page.pageSize; i++) {
      let t1 = tms[this.getRandomArbitrary(1, tms.length - 1)];
      let t2 = tms[this.getRandomArbitrary(1, tms.length - 1)];
      rs.push(new Game({
        id: i + 1,
        teamIds: [t1.id, t2.id],
        bets: [],
        teams: [t1, t2],
        externalId: "" + i,
        //mapping (uint :> Bet[]) bets,
        //game status
        drawBets: [],
        payoutLock: false,
        wasRefund: false,
        //end game status
        startDate: moment().add(1, "days"),
        endDate: moment().add(1, "days").add(1, "hours"),

        description: "Playing at home at random team",
        sportType: SportType.Football,

        minBetAmount: 100,
        allowDrawBets: true,
      }))
    }

    return rs;
  }

  addGame(game: Game) {

    let result = this.sportBetContract.addGame.sendTransaction(game.sportType, [game.teams[0].id, game.teams[1].id],
      game.startDate, game.endDate, game.allowDrawBets, game.minBetAmount, game.description, game.externalId,
      {
        gas: 4465034,
        from: this.accs[0].address
      }).then(rs => {
      this.logger.debug(this.constructor.name, "game added ok")
    }).catch(err => {
      this.logger.error(this.constructor.name, "Can't add new game match")
      this.logger.error(err)
    })
    this.logger.info(this.constructor.name, "Add new game match TX " + result)

  }

  getLogo(sportType: SportType): string {
    let rs = "";
    switch (sportType) {
      case SportType.Football:
        rs = "data:image/png;base64,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"
        break;
      case SportType.NFL:
        rs = "https://upload.wikimedia.org/wikipedia/en/a/a2/National_Football_League_logo.svg"
        break;
      case SportType.NCAAF:
        rs = "http://www.sportsbookgurus.com/news/wp-content/uploads/2010/11/ncaa-football-logo_110110554_std4.jpg"
        break;
      case SportType.NCAAB:
        rs = "http://www.mercadofichas.com/media/teams/thumbnails/timthumb.png"
        break;
      case SportType.NBA:
        rs = "http://cdn.bleacherreport.net/images/team_logos/328x328/nba.png"
        break;
      case SportType.MLB:
        rs = "https://cdn.vox-cdn.com/uploads/chorus_asset/file/8870319/1200px_Major_League_Baseball_logo.svg.png"
        break;
      case SportType.NHL:
        rs = "http://www.sportspool.com/hockey/images/nhl.gif"
        break;
      case SportType.Tennis:
        rs = "https://cdn.pixabay.com/photo/2012/04/24/18/18/tennis-40795_960_720.png"
        break;
      case SportType.WNBA:
        rs = "https://upload.wikimedia.org/wikipedia/en/0/00/WNBA_Alternate_Logo_2016.png"
        break;
      case SportType.MMA:
        rs = "https://i.imgur.com/MgvwdLt.jpg"
        break;
      case SportType.KHL:
        rs = "https://thehockeywriters.com/wp-content/uploads/2012/03/KHL-Logo.gif"
        break;
      case SportType.AHL:
        rs = "https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/0003/7571/brand.gif?itok=zcQSsel5"
        break;
      case SportType.SHL:
        rs = "https://seeklogo.com/images/S/swedish-hockey-league-logo-1B86CCD417-seeklogo.com.png"
        break;
      case SportType.HockeyAllsvenskan:
        rs = "http://www.vinnonline.se/wp-content/uploads/2015/01/Hockeyallsvenskan-Logo.jpeg"
        break;

    }

    return rs;
  }


}
