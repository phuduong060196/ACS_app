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
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import 'rxjs/add/operator/map';
import { FilterSupportProvider } from '../providers/filter-support/filter-support';

export interface MenuItem {
	title: string;
	component: any;
	icon: string;
}

interface Post {
	MessageBody: any;
}

@Component({
	templateUrl: 'app.html'
})
export class foodIonicApp {
	@ViewChild(Nav) nav: Nav;

	tabsPlacement: string = 'bottom';
	tabsLayout: string = 'icon-top';

	rootPage: any = 'page-auth';

	homeItem: any;

	chatItem: any;

	messagesItem: any;

	cartItem: any;

	accountMenuItems: Array<MenuItem>;

	userName: any;

	lastBack = 0;

	//for booking notification
	postsCol: AngularFirestoreCollection<Post>;
	posts: any;

	//for chat notification
	postsColChat: AngularFirestoreCollection<Post>;
	postsChat: any;

	constructor(private filterSupport: FilterSupportProvider, private alertCtrl: AlertController, private network: Network, private app: App, public loadingHelperPro: LoadingHelperProvider, public localHelperPro: LocalHelperProvider, public customerServicePro: CustomerServiceProvider, public numberNotificationHelperPro: NumberNotificationHelperProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private fcmPro: FcmProvider, private toastCtrl: ToastController, private notificationHelperPro: NotificationHelperProvider, private accessToken: AccessTokenHelperProvider, public database: AngularFirestore) {

		this.initializeApp();

		this.accountMenuItems = [
			{ title: 'Đăng nhập', component: 'page-auth', icon: 'log-in' },
			{ title: 'Tài khoản', component: 'page-my-account', icon: 'contact' },
			{ title: 'Đăng xuất', component: 'page-auth', icon: 'log-out' },
		];

		this.homeItem = { component: 'page-home' };
		this.messagesItem = { component: 'page-message-list' };
		this.cartItem = { component: 'page-cart' };
		this.chatItem = { component: 'page-chat-list' };

		this.accessToken.GetAccessToken.subscribe(
			(res: any) => {
				if (localStorage.getItem('token')) {
					this.userName = JSON.parse(localStorage.getItem('token')).username;
					this.rootPage = 'page-home';
				}
			}
		);
	}

	loadAllNotificationFromFirebase() {
		// this.accessToken.GetAccessToken.subscribe(
		// 	(tokenChanged) => {
		// 		if (localStorage.getItem('token')) {
		// 			const customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		// 			this.postsCol = this.database.collection('notification', ref => ref.where('CustomerId', '==', customerId).orderBy('Date', 'desc'));
		// 			this.posts = this.postsCol.valueChanges().subscribe(
		// 				(docChanged) => {
		// 					this.notificationHelperPro.SetTestNotification = docChanged;
		// 				}
		// 			)
		// 		}
		// 	}
		// );

		this.accessToken.GetAccessToken.subscribe(
			(tokenChanged) => {
				if (localStorage.getItem('token')) {
					const customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
					this.postsCol = this.database.collection('booking',
						ref => ref.where('CustomerId', '==', customerId).where('SeenByCustomer', '==', false));

					this.posts = this.postsCol.valueChanges().subscribe(
						(docChanged) => {
							this.notificationHelperPro.SetTestNotification = docChanged;
						}
					)
				}
			}
		);
	}

	loadAllChatFromFirebase() {
		this.accessToken.GetAccessToken.subscribe(
			(tokenChanged) => {
				if (localStorage.getItem('token')) {
					const customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
					this.postsColChat = this.database.collection('chat', ref => ref.where('cusId', '==', customerId).where('seenByCus', '==', false));
					this.postsChat = this.postsColChat.valueChanges().subscribe(
						(docChanged) => {
							this.numberNotificationHelperPro.SetTestNotification = docChanged;
						}
					)
				}
			}
		);
	}

	setNewNotificationOntoFirebase(res) {
		if (res.Document !== '1') {

			//Get customer ID
			this.accessToken.GetAccessToken.subscribe(
				(ref) => {
					if (localStorage.getItem('token')) {
						const customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
						//Add data to firebase
						this.database.collection('notification').add({
							'CustomerId': customerId,
							'MessageBody': res.MessageBody,
							'OrderId': parseInt(res.OrderId),
							'Date': new Date(),
							'SeenByCustomer': false,
						});
					}
				}
			)

		}
		;
	}

	initializeApp() {
		this.loadAllNotificationFromFirebase();
		this.loadAllChatFromFirebase();
		this.platform.ready().then(() => {
			this.statusBar.overlaysWebView(false);
			this.splashScreen.hide();
			this.network.onDisconnect().subscribe(
				(changed) => {
					this.alertCtrl.create({
						message: 'Vui lòng kết nối mạng để sử dụng ứng dụng',
						buttons: ['Xác nhận']
					}).present();
				}
			);
			this.filterSupport.SetFilterSearch = 'D';

			this.fcmPro.listenToNotifications().subscribe((res) => {
				if (!res.tap) {
					this.toastCtrl.create({
						message: res.body,
						position: 'top',
						showCloseButton: true,
						closeButtonText: 'Đóng',
						duration: 3000
					}).present();
				}

				// this.setNewNotificationOntoFirebase(res);
				this.loadAllNotificationFromFirebase();
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
							message: 'Nhấn lần nữa để thoát',
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
			this.loadingHelperPro.dismissLoading();
			this.nav.setRoot(page.component);
		} else {
			this.nav.setRoot(page.component);
		}
	}
}
