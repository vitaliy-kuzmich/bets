import {Injectable} from '@angular/core';
import {Web3MetaService} from "./web3.service";
import {Logger} from "@nsalaun/ng-logger";
import {SportType, Team, Web3Account} from "../main/main-data-model";
import {Observable} from "rxjs/Observable";

@Injectable()
export class TeamService {
  private sportBetContract: any
  private accs: Web3Account[]


  constructor(private logger: Logger, private web3Meta: Web3MetaService) {

    this.logger.info(this.constructor.name, "subscribing for contract :")
    this.web3Meta.sportBetContractSubjectO().subscribe((rs) => {
      this.sportBetContract = rs
      this.logger.info(this.constructor.name, "contract initialized")
    })
    this.web3Meta.accountsSubjectO().subscribe(rs => {
      this.accs = rs
    })
  }


  async addNewTeam(team: Team) {
    //bytes32 _sportType, bytes32 _teamName, bytes32 _description, bytes32 _externalId)
    // this.logger.info(this.constructor.name, "ADDING new team")
    //console.dir(team)
    let result = await this.sportBetContract.addTeam(
      team.sportType,
      team.teamName,
      team.description,
      team.externalId, {
      gas: 6712390,
      from: this.accs[0].address
    });
    this.logger.info(this.constructor.name, "Add new team TX " + result)

  }

  async getTeams(sportType: SportType, index?: number): Promise<Team[]> {
    return [new Team({
      id: 1,
      externalId: "1",
      teamName: "Arsenal",
      description: "Mock data team description URL",
      sportType: sportType,
    }),
      new Team({
        //id field could be empty, because it is Team internal ID from blockchain
        id: 2,
        externalId: "2",
        teamName: "Dnipro",
        description: "Mock data team description2 Dnipro URL",
        sportType: sportType,
      }),
    ]

  }
}
