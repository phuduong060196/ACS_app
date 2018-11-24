import {Component, OnInit} from "@angular/core";
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {OrdersService} from '../../providers/orders-service-mock';
import {CartService} from '../../providers/cart-service-mock';
import {InAppBrowser, InAppBrowserObject, InAppBrowserOptions} from "@ionic-native/in-app-browser";
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import 'rxjs/add/operator/map';

interface Post {
	CurrentStatus: any;
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
	postsCol1: AngularFirestoreCollection<Post>;
	browser: any;


	constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public ordersService: OrdersService, public cartService: CartService, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private inAppBrowser: InAppBrowser, public database: AngularFirestore) {
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

	loadDocument() {
		// this.loadingPro.presentLoading('Đang tải...');
		//get Order Information
		this.postsCol = this.database.collection('booking', ref => ref.where('OrderId', '==', this.order.OrderId));
		this.posts = this.postsCol.snapshotChanges()
			.map(actions => {
				return actions.map(a => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					if (data.CurrentStatus.Name === 'Customer paid'){

					}
					return {data, id};
				});
			});
	}

	closeBrowser(id){
	}

	openNganluong(bookingId){
		let url = "https://www.nganluong.vn/button_payment.php?" +
			"receiver=" + this.order.SupplierInfo.PaymentEmail +
			"&product_name=" + this.order.OrderId +
			"&price=" + this.order.PaymentPrice +
			"&comments=test ionic" +
			"&return_url=http://web-capstone.azurewebsites.net/api/notify-finish-payment?orderId=" + this.order.OrderId +
			"," + bookingId;
		const browserOpt: InAppBrowserOptions ={
			hideurlbar: 'yes'
		};
		const browser = this.inAppBrowser.create(url, '_self', browserOpt);
		this.postsCol = this.database.collection('booking', ref => ref.where('OrderId', '==', this.order.OrderId));
		this.posts = this.postsCol.snapshotChanges()
			.map(actions => {
				return actions.map(a => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					if (data.CurrentStatus.Name === 'Customer paid'){
						browser.close();
						this.navCtrl.setRoot('page-home');
					}
					return {data, id};
				});
			});
	}

	ngOnInit(): void {
		this.loadDocument();
	}


}
