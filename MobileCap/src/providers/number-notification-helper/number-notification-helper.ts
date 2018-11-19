import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class NumberNotificationHelperProvider {
  private NumberNotification: BehaviorSubject<any>;
  constructor() {
    this.NumberNotification = new BehaviorSubject<any>({
      'Number': 0,
      'Tapped': true
    });
  }
  get GetTestNotification() {
    return this.NumberNotification.asObservable();
  }
  set SetTestNotification(val) {
    this.NumberNotification.next(val);
  }
}
