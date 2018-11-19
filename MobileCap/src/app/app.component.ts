import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FcmProvider } from '../providers/fcm/fcm';
import { NotificationHelperProvider } from '../providers/notification-helper/notification-helper';
import { NumberNotificationHelperProvider } from '../providers/number-notification-helper/number-notification-helper';

export interface MenuItem {
	title: string;
	component: any;
	icon: string;
}

@Component({
	templateUrl: 'app.html'
})
export class foodIonicApp {
	@ViewChild(Nav) nav: Nav;

	tabsPlacement: string = 'bottom';
	tabsLayout: string = 'icon-top';

	rootPage: any = 'page-auth';
	showMenu: boolean = true;

	homeItem: any;

	initialItem: any;

	chatItem: any;

	messagesItem: any;

	cartItem: any;

	settingsItem: any;

	appMenuItems: Array<MenuItem>;

	yourRestaurantMenuItems: Array<MenuItem>;

	accountMenuItems: Array<MenuItem>;

	helpMenuItems: Array<MenuItem>;

	constructor(public numberNotificationHelperPro: NumberNotificationHelperProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private fcmPro: FcmProvider, private toastCtrl: ToastController, private notificationHelperPro: NotificationHelperProvider) {
		this.initializeApp();
		this.homeItem = { component: 'page-home' };
		this.messagesItem = { component: 'page-message-list' };
		this.cartItem = { component: 'page-cart' };
		this.chatItem = { component: 'page-chat-list' };

		this.accountMenuItems = [
			{ title: 'Đăng nhập', component: 'page-auth', icon: 'log-in' },
			{ title: 'Tài khoản', component: 'page-my-account', icon: 'contact' },
			{ title: 'Đăng xuất', component: 'page-auth', icon: 'log-out' },
		];
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.overlaysWebView(false);
			this.splashScreen.hide();

			this.fcmPro.getToken();

			this.fcmPro.listenToNotifications().subscribe((res) => {
				if (!res.tap) {
					this.toastCtrl.create({
						message: res.body,
						position: 'top',
						showCloseButton: true,
						closeButtonText: 'Đóng'
					}).present();
				}
				this.notificationHelperPro.GetTestNotification.subscribe((val) => {
					let listNewNotification = val;
					listNewNotification.unshift({
						'OrderId': parseInt(res.OrderId),
						'MessageBody': res.MessageBody,
						'tap': false,
						'date': new Date()
					});
					this.notificationHelperPro.SetTestNotification(listNewNotification);
				});
				this.numberNotificationHelperPro.GetTestNotification.subscribe((val) => {
					let numberNotification = val;
					let number = numberNotification.Number++;
					numberNotification = {
						'Number': number,
						'Tapped': false
					}
					this.numberNotificationHelperPro.SetTestNotification = numberNotification;
				});
			});

		});

		if (!this.platform.is('mobile')) {
			this.tabsPlacement = 'top';
			this.tabsLayout = 'icon-left';
		}
	}

	openPage(page) {
		if (page.component) {
			this.nav.setRoot(page.component);
		} else {

		}
	}
}
