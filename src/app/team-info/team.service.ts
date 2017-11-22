import {Injectable} from '@angular/core';
import {Web3MetaService} from "../util/web3.service";
import {Logger} from "@nsalaun/ng-logger";
import Web3 from 'web3';
import {SportType, Team, Web3Account} from "../data-types/data-types.module";

@Injectable()
export class TeamService {
  private sportBetContract: any
  private accs: Web3Account[]
  private web3: Web3;

  constructor(private logger: Logger, private web3Meta: Web3MetaService) {

    this.logger.info(this.constructor.name, "subscribing for contract :")
    this.web3Meta.sportBetContractSubjectO().subscribe((rs) => {
      this.sportBetContract = rs
      this.logger.info(this.constructor.name, "contract initialized")
    })
    this.web3Meta.accountsSubjectO().subscribe(rs => {
      this.accs = rs
    })
    this.web3Meta.web3SubjectO().subscribe(rs => {
      this.web3 = rs
    })
  }


  async addNewTeam(team: Team) {
    //32 _sportType, bytes32 _teamName, bytes32 _description, bytes32 _externalId
    this.sportBetContract.addTeam(
      team.sportType,
      team.teamName,
      team.description,
      team.externalId, {
        gas: 4465034,
        from: this.accs[0].address
      }, (err, rs) => {
        this.logger.info(this.constructor.name, "Add new team TX https://ropsten.etherscan.io/tx/" + rs)
      });
  }

  async getTeams(sportType: SportType): Promise<Team[]> {

    let rs = []
    for (let i = 0; i < 10; i++) {
      rs.push(new Team({
        id: i + 1,
        externalId: "" + i,
        teamName: "Team #" + i,
        description: "Mock data team description URL",
        sportType: sportType,
        iconUrl: "http://freevectorlogo.net/wp-content/uploads/2012/12/manchester-united-logo-vector.png"
      }))
    }

    return rs;
  }

  getTeamFromChain(ids: number[]) {
    this.sportBetContract.getTeam([6], (err, rs) => {
      console.log("raw team :")
      console.dir(rs)

      let decodedTeam = new Team({
        id: rs[0][0].valueOf(),
        teamName: this.web3Meta.toAscii(rs[1][0]),
        description: this.web3Meta.toAscii(rs[2][0]),
        sportType: this.web3Meta.toAscii(rs[3][0]),
      })
      console.log("Decoded team :")
      console.dir(decodedTeam)

    })

  }


}
