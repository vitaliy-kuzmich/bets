import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material";
import {SnackNotifyComponent} from "../main/snack-notify/snack-notify.component";
import {SnackErrorComponent} from "../main/snack-error/snack-error.component";
import {Logger} from "@nsalaun/ng-logger";

@Injectable()
export class NotificationService {

  constructor(public snackBar: MatSnackBar, private logger: Logger) {
  }

  public notify(cfg: MatSnackBarConfig) {
    //this.snackBar.openFromComponent(SnackNotifyComponent, cfg);
  }

  public err(cfg: MatSnackBarConfig) {
    //this.snackBar.openFromComponent(SnackErrorComponent, cfg);
  }

  public notifySimple(msg: string, duration: number) {
    this.snackBar.open(msg, 'Hide', {
      duration: duration
    });
  }

  public errSimple() {

  }

  public processErr(message?: any, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams)
  }

}
