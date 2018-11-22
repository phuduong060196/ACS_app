import {Component, OnInit} from "@angular/core";
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {OrdersService} from '../../providers/orders-service-mock';
import {CartService} from '../../providers/cart-service-mock';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import 'rxjs/add/operator/map';

interface Post {
	OrderId: number;
}

@IonicPage({
	name: 'page-checkout',
	segment: 'checkout'
})

@Component({
	selector: 'page-checkout',
	templateUrl: 'checkout.html'
})

export class CheckoutPage implements OnInit {
	order: any;
	checkoutData: any;
	totalVal: number = 0;
	orderNumber: number = Math.floor(Math.random() * 10000);
	checkoutOnline: boolean;
	posts: any;
	postsCol: AngularFirestoreCollection<Post>;
	flagPaid: boolean;

	constructor(public nav: NavController, public navParams: NavParams, private storage: Storage, public ordersService: OrdersService, public cartService: CartService, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private inAppBrowser: InAppBrowser, public database: AngularFirestore) {
		// this.checkoutData = this.navParams.data.orders;
		this.order = this.navParams.get('order');
	}

	getRadioValue(number) {
		if (number == 2) {
			this.checkoutOnline = true;
		}else {
			this.checkoutOnline = false;
		}
	}

	// process send button
	// send() {
	// 	let loader = this.loadingCtrl.create({
	// 		content: "Please wait..."
	// 	});
	// 	// show message
	// 	let toast = this.toastCtrl.create({
	// 		showCloseButton: true,
	// 		cssClass: 'profile-bg',
	// 		message: 'Thanh toán thành công',
	// 		duration: 3000,
	// 		position: 'bottom'
	// 	});
	//
	// 	loader.present();
	//
	// 	setTimeout(() => {
	// 		loader.dismiss();
	//
	// 		this.ordersService.saveOrder(this.checkoutData, this.totalVal, this.orderNumber).then(data => {
	// 			toast.present();
	// 			this.cartService.cleanCart();
	// 		})
	// 		// back to home page
	// 		this.nav.setRoot('page-home');
	// 	}, 3000)
	// }

	loadDocument() {
		// this.loadingPro.presentLoading('Đang tải...');
		//get Order Information
		this.postsCol = this.database.collection('booking', ref => ref.where('OrderId', '==', this.order.OrderId));
		this.posts = this.postsCol.snapshotChanges()
			.map(actions => {
				return actions.map(a => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					this.flagPaid = true;
					// this.loadingPro.dismissLoading();
					return {data, id};
				});
			});
	}

	openNganluong(bookingId){
		let url = 'https://www.nganluong.vn/button_payment.php?' +
			'receiver=' + this.order.SupplierInfo.PaymentEmail +
			'&product_name=' + this.order.OrderId +
			'&price=' + this.order.PaymentPrice +
			'&return_url=http://web-capstone.azurewebsites.net/api/notify-finish-payment?orderId=' + this.order.OrderId +
			'&bookingId=' + bookingId +
			'&comments=test ionic';
		const browser = this.inAppBrowser.create(url, '_self');
	}

	openSuccessPage(flag){
		if (flag === true){
		}
	}

	ngOnInit(): void {

	}


}
