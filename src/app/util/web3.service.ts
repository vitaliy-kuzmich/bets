import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Web3Account} from "../main/main-data-model";
import sportBetsArtifact from '../../../build/contracts/SportBets.json';
import {Logger} from '@nsalaun/ng-logger';
import {Observable} from "rxjs/Observable";
import Web3 from 'web3';

@Injectable()
export class Web3MetaService {
  private web3Eth: Web3;
  private accounts: Web3Account[];
  private sportsBetContract: any;
  private afterLoaded: BehaviorSubject<any>;

  private accountsSubject;
  private web3Subject;
  private sportBetContractSubject;

  public accountsSubjectO(): Observable<Web3Account[]> {
    return this.accountsSubject.asObservable();
  }

  public web3SubjectO(): Observable<any> {
    return this.web3Subject.asObservable();
  }

  public sportBetContractSubjectO(): Observable<any> {
    return this.sportBetContractSubject.asObservable();
  }

  public afterLoadedO(): Observable<any> {
    return this.afterLoaded.asObservable()
  }


  constructor(private logger: Logger) {
    this.accountsSubject = new BehaviorSubject<Web3Account[]>([]);
    this.web3Subject = new BehaviorSubject<any>({});
    this.sportBetContractSubject = new BehaviorSubject<any>({});
    this.afterLoaded = new BehaviorSubject<any>(null);

    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
    Web3.toAsciiOriginal = Web3.toAscii;
    Web3.toAscii = function (input) {
      return Web3.toAsciiOriginal(input).replace(/\u0000/g, '');
    }


    //metamask
    if (typeof (<any>window).web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3Eth = new Web3((<any>window).web3.currentProvider);
      this.logger.info("using MetaMask")
    } else {
      // testrpc
      this.web3Eth = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }

    this.web3Eth.eth.defaultAccount = this.web3Eth.eth.coinbase

    // let addr = sportBetsArtifact.networks[1510652626841].address;
    let addr = "0x6d4d6f9c1582b21dd3113fb3cfc770d7d4163fae";
    this.logger.info(this.constructor.name, "SportBets addr: ", addr)

    this.sportsBetContract = this.web3Eth.eth.contract(sportBetsArtifact.abi).at(addr);

    this.sportsBetContract.getGamesLen().then(rs => console.dir(rs[0].words[0]))

    console.dir(this.web3Eth)
    this.resetContract();

  }

  resetContract() {
    this.logger.info(this.constructor.name, " resetting contract  ");
    this.web3Subject.next(this.web3Eth);
    /*  this.sportBetContractSubjectO().subscribe(rs => {
		console.dir(rs)
	  })*/
    this.sportBetContractSubject.next(this.sportsBetContract);
    this.refreshAccounts();
    this.afterLoaded.next(true);
  }

  public toAscii(data: any) {
    if (!data) return data;
    return this.web3Eth.toAscii(data);

  }

  refreshAccounts() {

    //this.accounts = this.web3Eth.eth.accounts;
    this.accounts = [];
    this.web3Eth.eth.accounts.forEach(acc => {
      this.accounts.push({
        address: acc,
        balance: this.web3Eth.eth.getBalance(acc).valueOf()
      });
    });

    this.accountsSubject.next(this.accounts);
  }


}
