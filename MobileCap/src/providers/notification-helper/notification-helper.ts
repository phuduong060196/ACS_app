import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class NotificationHelperProvider {
  private Notification: BehaviorSubject<any>;
  constructor() {
    this.Notification = new BehaviorSubject<any>([]);
  }
  get GetTestNotification() {
    return this.Notification.asObservable();
  }
  set SetTestNotification(val) {
    this.Notification.next(val);
  }
}