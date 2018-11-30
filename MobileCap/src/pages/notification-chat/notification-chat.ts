import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NumberNotificationHelperProvider} from "../../providers/number-notification-helper/number-notification-helper";

/**
 * Generated class for the NotificationChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'page-notification-chat',
	segment: 'notification-chat'
})
@Component({
	selector: 'page-notification-chat',
	templateUrl: 'notification-chat.html',
})
export class NotificationChatPage {
	listNotification: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, private numberNotification: NumberNotificationHelperProvider) {
		this.numberNotification.GetTestNotification.subscribe(
			(val) => {
				this.listNotification = val;
			}
		)
	}

	setNumberNotificationChat() {
		return this.listNotification.length;
	}

	goToChatList() {
		this.navCtrl.push('page-chat-list');
	}

}
