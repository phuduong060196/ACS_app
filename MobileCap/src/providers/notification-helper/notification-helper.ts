import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class NotificationHelperProvider {
  private TestNotification: BehaviorSubject<any>;
  constructor() {
    this.TestNotification = new BehaviorSubject<any>([]);
  }
  get GetTestNotification() {
    return this.TestNotification.asObservable();
  }
  set SetTestNotification(val) {
    this.TestNotification.next(val);
  }
}