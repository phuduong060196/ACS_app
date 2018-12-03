import {Component, OnInit} from "@angular/core";
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from "ionic-angular";
import {InAppBrowser, InAppBrowserOptions} from "@ionic-native/in-app-browser";
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
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
	checkoutOnline: boolean;
	posts: any;
	postsCol: AngularFirestoreCollection<Post>;
	browser: any;
	private booking_path = 'booking';


	constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private inAppBrowser: InAppBrowser, public database: AngularFirestore) {
		// this.checkoutData = this.navParams.data.orders;
		this.order = this.navParams.get('order');
		if (!this.order.Total) {
			this.order.Total = 'Liên hệ';
		}
	}

	getRadioValue(number) {
		if (number == 2) {
			this.checkoutOnline = true;
		} else {
			this.checkoutOnline = false;
		}
	}

	loadDocument() {
		//get Order Information
		this.postsCol = this.database.collection(this.booking_path, ref => ref.where('OrderId', '==', this.order.OrderId));
		this.posts = this.postsCol.snapshotChanges()
			.map(actions => {
				return actions.map(a => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					return {data, id};
				});
			});
	}

	openNganluong(bookingId) {
		if (this.order) {
			let url = "https://www.nganluong.vn/button_payment.php?" +
				"receiver=" + this.order.SupplierInfo.PaymentEmail +
				"&product_name=" + this.order.OrderId +
				"&price=" + this.order.PaymentPrice +
				"&comments=" + this.order.Description +
				"&return_url=http://web-capstone.azurewebsites.net/api/notify-finish-payment?orderId=" + this.order.OrderId +
				"," + bookingId;
			const browserOpt: InAppBrowserOptions = {
				hideurlbar: 'yes'
			};
			const browser = this.inAppBrowser.create(url, '_self', browserOpt);
			this.postsCol = this.database.collection(this.booking_path, ref => ref.where('OrderId', '==', this.order.OrderId));
			this.posts = this.postsCol.snapshotChanges()
				.map(actions => {
					return actions.map(a => {
						const data = a.payload.doc.data();
						if (data.CurrentStatus.Name === 'Customer paid') {
							browser.close();
							//Set flag to define order status
							const result = {'orderId': this.order.OrderId};
							this.navCtrl.setRoot('page-cart', {
								'result': result
							});
						}
					});
				});
		}
	}

	openOrderResult(id) {
		if (this.order) {
			//Go to result page
			const result = {'orderId': this.order.OrderId};
			this.navCtrl.setRoot('page-cart', {
				'result': result
			});
		}
	}

	ngOnInit(): void {
		this.loadDocument();
	}


}
