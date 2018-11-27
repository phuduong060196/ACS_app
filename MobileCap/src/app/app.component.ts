import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FcmProvider } from '../providers/fcm/fcm';
import { NotificationHelperProvider } from '../providers/notification-helper/notification-helper';
import { NumberNotificationHelperProvider } from '../providers/number-notification-helper/number-notification-helper';
import { AccessTokenHelperProvider } from '../providers/access-token-helper/access-token-helper';
import { CustomerServiceProvider } from '../providers/customer-service/customer-service';
import { LocalHelperProvider } from '../providers/local-helper/local-helper';
import { LoadingHelperProvider } from '../providers/loading-helper/loading-helper';
import { Network } from '@ionic-native/network';

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

	userName: any;

	lastBack = 0;

	constructor(private alertCtrl: AlertController, private network: Network, private app: App, public loadingHelperPro: LoadingHelperProvider, public localHelperPro: LocalHelperProvider, public customerServicePro: CustomerServiceProvider, public numberNotificationHelperPro: NumberNotificationHelperProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private fcmPro: FcmProvider, private toastCtrl: ToastController, private notificationHelperPro: NotificationHelperProvider, private accessToken: AccessTokenHelperProvider) {
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

		this.accessToken.GetAccessToken.subscribe(
			(res: any) => {
				if (localStorage.getItem('token')) {
					this.userName = JSON.parse(localStorage.getItem('token')).username;
					this.rootPage = 'page-home';
				}
			}
		);
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.overlaysWebView(false);
			this.splashScreen.hide();

			// this.network.onDisconnect().subscribe(
			// 	(changed) => {
			// 		this.alertCtrl.create({
			// 			message: 'Vui lòng kết nối mạng để sử dụng ứng dụng',
			// 			buttons: ['Xác nhận']
			// 		}).present();
			// 	}
			// );

			this.fcmPro.listenToNotifications().subscribe((res) => {
				if (!res.tap) {
					this.toastCtrl.create({
						message: res.body,
						position: 'top',
						showCloseButton: true,
						closeButtonText: 'Đóng'
					}).present();
				}
				if (res.Document !== '1') {
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
				}
			});

			this.platform.registerBackButtonAction(
				() => {
					const overlay = this.app._appRoot._overlayPortal.getActive();
					const nav = this.app.getActiveNav();

					if (overlay && overlay.dismiss) {
						overlay.dismiss();
					} else if (nav.canGoBack()) {
						nav.pop();
					} else if ((Date.now() - this.lastBack) < 2000) {
						this.platform.exitApp();
					} else if ((Date.now() - this.lastBack) > 2000) {
						this.toastCtrl.create({
							message: 'Bấm Back để thoát khỏi ứng dụng',
							position: 'bottom',
							duration: 2000
						}).present();
					}
					this.lastBack = Date.now();
				}
			);

		});

		if (!this.platform.is('mobile')) {
			this.tabsPlacement = 'top';
			this.tabsLayout = 'icon-left';
		}
	}

	openPage(page) {
		if (page.title === 'Đăng xuất') {
			this.loadingHelperPro.presentLoading('');
			this.customerServicePro.logout();
			this.localHelperPro.SetLocation = null;
			this.loadingHelperPro.dismissLoading();
			this.nav.setRoot(page.component);
		} else {
			this.nav.setRoot(page.component);
		}
	}
}
