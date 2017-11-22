import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import sportBetsArtifact from '../../../build/contracts/SportBets.json';
import {Logger} from '@nsalaun/ng-logger';
import {Observable} from "rxjs/Observable";
import Web3 from 'web3';
import {NotificationService} from "./notification.service";
import {Web3Account} from "../data-types/data-types.module";
import {Constants} from "./constants";

@Injectable()
export class Web3MetaService {
  private web3Eth: Web3;
  private accounts: Web3Account[];
  private sportsBetContract: any;
  private afterLoaded: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private accountsSubject = new BehaviorSubject<Web3Account[]>([]);
  private web3Subject = new BehaviorSubject<any>({});
  private sportBetContractSubject = new BehaviorSubject<any>({});

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


  constructor(private logger: Logger, private notificationService: NotificationService) {
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;

    /*    Web3.toAsciiOriginal = Web3.toAscii;
		Web3.toAscii = function (input) {
		  return Web3.toAsciiOriginal(input).replace(/\u0000/g, '');
		}*/


    //metamask
    if (typeof (<any>window).web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3Eth = new Web3((<any>window).web3.currentProvider);
      this.logger.info(this.constructor.name, "using MetaMask")
      this.web3Eth.eth.defaultAccount = this.web3Eth.eth.coinbase

      // let addr = sportBetsArtifact.networks[1510652626841].address;
      let addr = Constants.sportBetsAddress;
      this.logger.info(this.constructor.name, "SportBets addr: ", addr)

      this.sportsBetContract = this.web3Eth.eth.contract(sportBetsArtifact.abi).at(addr);
      /*
		  this.sportsBetContract.getGamesLen((err, rs) => {
			if (!err) {
			  this.logger.error(err)
			}
		  console.dir(rs.valueOf())

		  })

		  console.dir(this.web3Eth)*/
      this.resetContract();
    } else {

      /*   let cfg = new MatSnackBarConfig()
		 cfg.duration = 10000
		 cfg.announcementMessage = "Can't connect to MetaMask!"*/
      this.notificationService.notifySimple("Can't connect to MetaMask!", 10000)

      // testrpc
      // this.web3Eth = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      // this.logger.info(this.constructor.name, "using TestRPC")
    }


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

  public toAscii(hexx: any): string {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str.replace(/\u0000/g, '');
  }

  refreshAccounts() {

    //this.accounts = this.web3Eth.eth.accounts;
    this.accounts = [];

    this.web3Eth.eth.getAccounts((err, accs) => {
      if (accs.length == 0) {

        this.notificationService.notifySimple("Please login to MetaMask, and press f5", 5000)
      }
      accs.forEach(acc => {
        this.web3Eth.eth.getBalance(acc, (err, balance) => {
          this.accounts.push({
            address: acc,
            balance: this.web3Eth.fromWei(balance.valueOf())
          });
        })


        this.accountsSubject.next(this.accounts);
      })

    })
  }


  fromAscii(str): any {
    var arr = [];
    for (var i = 0, l = str.length; i < l; i++) {
      var hex = Number(str.charCodeAt(i)).toString(16);
      arr.push(hex);
    }
    return arr.join('');
  }
}
