import { Component } from '@angular/core';
import {
	IonicPage,
	NavController,
	AlertController,
	MenuController,
	ToastController,
	PopoverController,
	ModalController,
	NavParams
} from 'ionic-angular';

import { HttpHelperProvider } from '../../providers/http-helper/http-helper';
import { SupplierServiceProvider } from '../../providers/supplier-service/supplier-service';
import { NotificationHelperProvider } from '../../providers/notification-helper/notification-helper';
import { NumberNotificationHelperProvider } from '../../providers/number-notification-helper/number-notification-helper';
import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';

@IonicPage({
	name: 'page-home',
	segment: 'home',
	priority: 'high'
})

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})

export class HomePage {

	suppliers: any;
	suppliersNearby: any;
	lat: number;
	lng: number;
	searchKey: string;
	yourLocation: string;
	notifications: any;
	listType: any;
	numberNotificationChat: any;

	constructor(
		public loadingHelperPro: LoadingHelperProvider, public navParams: NavParams,
		public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController,
		public locationCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController,
		public httpHelperPro: HttpHelperProvider, public supplierServicePro: SupplierServiceProvider,
		private notificationHelperPro: NotificationHelperProvider, public numberNotificationHelperPro: NumberNotificationHelperProvider) {
		
		this.notificationHelperPro.GetTestNotification.subscribe((val) => {
			this.notifications = val;
		});
		this.numberNotificationHelperPro.GetTestNotification.subscribe(
			(val) => {
				this.numberNotificationChat = val;
			}
		);
		this.listType = this.getAllType();
		this.menuCtrl.swipeEnable(true, 'authenticated');
		this.menuCtrl.enable(true);
	}

	numberNotification() {
		return this.notifications.filter(el => el.SeenByCustomer === false).length;
	}

	setNumberNotificationChat(){
		return this.numberNotificationChat.length;
	}

	openSupplierList() {
		this.navCtrl.push('page-supplier-list');
	}

	openCart() {
		this.navCtrl.push('page-cart');
	}

	openSupplierDetail(supplier: any) {
		this.navCtrl.push('page-supplier-detail', {
			'supplier': supplier
		});
	}

	openNotificationsPage() {
		this.navCtrl.push('page-notifications');
	}

	openSearchPage() {
		this.navCtrl.push('page-search');
	}

	onInput(event) {
		console.log(event.data);
	}

	onCancel(event) {

	}

	getAllSuppliers() {
		this.httpHelperPro.get('/api/supplier/search?name=&searchBy=price&sort=desc').subscribe(
			(res: any) => {
				this.suppliers = res.data;
			},
			(err) => {
				console.log(err);
			}
		);
	}

	presentNotifications(myEvent) {
		let popover = this.popoverCtrl.create('page-notifications');
		popover.present({
			ev: myEvent
		});
	}

	presentNotificationsChat(myEvent) {
		// console.log(myEvent);
		let popover = this.popoverCtrl.create('page-notification-chat');
		popover.present({
			ev: myEvent
		});
	}

	ionViewWillEnter() {
		this.navCtrl.canSwipeBack();
	}

	getAllType() {
		this.loadingHelperPro.presentLoading('Đang tải...');
		this.httpHelperPro.get('/api/service/all-serivce-type').subscribe(
			(res: any) => {
				res.forEach(element => {
					let oldUrl = element.Avatar;
					element.Avatar = 'http://web-capstone.azurewebsites.net' + oldUrl;
				});
				this.listType = res;
				// console.log(this.listType);
				this.loadingHelperPro.dismissLoading();
			},
			(err) => {
				console.log(err);
				this.loadingHelperPro.dismissLoading();
			}
		);
	}

	openListType(type) {
		// console.log(type);
		this.navCtrl.push('page-service-list', {
			'type': type
		});
	}
}
