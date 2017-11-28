import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Logger} from "@nsalaun/ng-logger";

/**
 * responsible for managing app services loading
 */
@Injectable()
export class LoadingService {
  //trigger when all services finished load
  private showGlobalLoader: BehaviorSubject<any>
  private contextGlobal: any
  private counterGlobal: number

  private showQueryLoader: BehaviorSubject<any>
  private contextQuery: any
  private counterQuery: number

  constructor(private logger: Logger) {
    this.showGlobalLoader = new BehaviorSubject(false)
    this.showQueryLoader = new BehaviorSubject(false)
    this.contextGlobal = {}
    this.contextQuery = {}
    this.counterGlobal = 0
    this.counterQuery = 0
  }

  public showGlobalLoaderO() {
    return this.showGlobalLoader.asObservable()
  }

  public showQueryLoaderO() {
    return this.showQueryLoader.asObservable()
  }


  public triggerGlobalLoader(service: string, show: boolean) {
    if (show) {
      if (!this.contextGlobal[service]) {
        this.contextGlobal[service] = show
        this.counterGlobal++
      }
    } else {
      if (this.contextGlobal[service]) {
        this.contextGlobal[service] = show
        this.counterGlobal--

      }
    }
    if (this.counterGlobal == 0) {
      this.showGlobalLoader.next(false)
    } else {
      this.showGlobalLoader.next(true)
    }
    this.logger.info("G trigger  loading for service ", service, show, this.counterGlobal)
  //  console.dir(this.contextGlobal)


  }

  /*
	public startLoading(service: string) {
	  this.contextGlobal[service] = true

	}

	public finishLoading(service: string) {
	  this.contextGlobal[service] = false
	  this.counterGlobal--
	  if (this.counterGlobal == 0) {
		let filtered = Object.keys(this.contextGlobal).filter(k => !this.contextGlobal[k])
		if (filtered.length > 0) {
		  this.logger.error("Issue with loading services")
		} else {
		  this.showGlobalLoader.next(true)
		}
	  }
	}*/

  public triggerQueryLoading(service: string, show: boolean) {

    if (show) {
      if (!this.contextQuery[service]) {
        this.contextQuery[service] = show
        this.counterQuery++
      }
    } else {
      if (this.contextQuery[service]) {
        this.contextQuery[service] = show
        this.counterQuery--

      }
    }
    if (this.counterQuery == 0) {
      this.showQueryLoader.next(false)
    } else {
      this.showQueryLoader.next(true)
    }

    this.logger.info("Q trigger  loading for service ", service, show)
  }

}
