import { Component } from "@angular/core";
import { IonicPage, NavController, ViewController } from "ionic-angular";
import { NotificationHelperProvider } from '../../providers/notification-helper/notification-helper';

@IonicPage({
  name: 'page-notifications'
})

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})

export class NotificationsPage {

  notifications: any;

  constructor(private notificationHelperPro: NotificationHelperProvider, public navCtrl: NavController, public viewCtrl: ViewController) {
    this.notificationHelperPro.GetTestNotification.subscribe((val) => {
      this.notifications = val;
    })
  }

  numberNotification() {
    return this.notifications.filter(el => el.tap === false).length
  }

  close() {
    this.viewCtrl.dismiss();
  }

  messages() {
    this.navCtrl.push('page-message-list');
  }
}
