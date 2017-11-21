import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Logger} from "@nsalaun/ng-logger";

/**
 * responsible for managing app services loading
 */
@Injectable()
export class LoadingService {
  //trigger when all services finished load
  private loadFinished: BehaviorSubject<any>;
  private loadProgress: BehaviorSubject<any>;
  private context: any
  private counter: number

  constructor(private logger: Logger) {
    this.loadFinished = new BehaviorSubject(false);
    this.context = {}
    this.counter = 3
  }


  public startLoading(service: string) {
    this.context[service] = true

  }

  public finishLoading(service: string) {
    this.context[service] = false
    this.counter--
    if (this.counter == 0) {
      let filtered = Object.keys(this.context).filter(k => !this.context[k])
      if (filtered.length > 0) {
        this.logger.error("Issue with loading services")
      } else {
        this.loadFinished.next(true)
      }
    }
  }

}
