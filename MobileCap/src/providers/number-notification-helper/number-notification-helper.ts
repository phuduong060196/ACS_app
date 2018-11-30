import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class NumberNotificationHelperProvider {
  private NumberNotification: BehaviorSubject<any>;
  constructor() {
    this.NumberNotification = new BehaviorSubject<any>([]);
  }
  get GetTestNotification() {
    return this.NumberNotification.asObservable();
  }
  set SetTestNotification(val) {
    this.NumberNotification.next(val);
  }
}
