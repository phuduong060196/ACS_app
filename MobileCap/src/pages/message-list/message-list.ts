import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { NotificationHelperProvider } from '../../providers/notification-helper/notification-helper';

@IonicPage({
    name: 'page-message-list',
    segment: 'message-list'
})

@Component({
    selector: 'page-message-list',
    templateUrl: 'message-list.html'
})
export class MessageListPage {

    messages: any;

    constructor(private notificationHelperPro: NotificationHelperProvider, public navCtrl: NavController) {
        this.notificationHelperPro.GetTestNotification.subscribe((val) => {
            this.messages = val;
        });
    }

    itemTapped(message) {
        this.notificationHelperPro.GetTestNotification.subscribe((val) => {
            let notifications = val;
            notifications[notifications.indexOf(message)].tap = true;
            this.notificationHelperPro.SetTestNotification(notifications);
        });
        // chuyen trang can chinh
        this.navCtrl.push('page-order-detail', {
            'message': message
        });
    }

    deleteItem(message) {
        this.notificationHelperPro.GetTestNotification.subscribe((val) => {
            let notifications = val;
            notifications.splice(notifications.indexOf(message), 1);
            this.notificationHelperPro.SetTestNotification(notifications);
        });
    }

}
