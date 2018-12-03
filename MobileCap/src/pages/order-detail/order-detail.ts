import {Component, OnInit} from '@angular/core';
import {
	AlertController,
	IonicPage,
	LoadingController,
	ModalController,
	NavController,
	NavParams,
	ToastController
} from 'ionic-angular';

import {LoadingHelperProvider} from '../../providers/loading-helper/loading-helper';
import {HttpHelperProvider} from '../../providers/http-helper/http-helper';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import 'rxjs/add/operator/map';

interface Post {
	CurrentStatus: any;
}

@IonicPage({
	name: 'page-order-detail',
	segment: 'order-detail'
})
@Component({
	selector: 'page-order-detail',
	templateUrl: 'order-detail.html',
})
export class OrderDetailPage implements OnInit {

	message: any;
	order: any;
	services: any;
	customerInfo: any;
	posts: any;
	postsCol: AngularFirestoreCollection<Post>;
	private booking_path = 'booking';
	supplierInfo: any;
	supplier: any;

	constructor(private httpHelperPro: HttpHelperProvider, private loadingHelperPro: LoadingHelperProvider, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public database: AngularFirestore) {
		this.message = this.navParams.get('message');
	}

	ngOnInit() {
		this.loadOrderDetail();
		this.loadDocument();
	}

	loadOrderDetail() {
		if (this.message) {
			this.loadingHelperPro.presentLoading('Đang tải...');
			this.httpHelperPro.get('/api/order/order-detail?orderId=' + this.message.OrderId).subscribe(
				(res: any) => {
					this.order = res.order;
					this.services = this.order.OrderDetails;
					this.customerInfo = res.customerInfo;
					this.supplierInfo = this.order.SupplierInfo;
					this.loadSupplier();
					this.loadingHelperPro.dismissLoading();
				},
				(err) => {
					console.log(err);
					this.loadingHelperPro.dismissLoading();
				}
			);
		}
	}

	loadSupplier() {
		if (this.supplierInfo) {
			this.loadingHelperPro.presentLoading('Đang tải...');
			this.httpHelperPro.get('/api/supplier/get-by-id?id=' + this.supplierInfo.SupplierId)
				.subscribe((res: any) => {
					let oldUrl = res.data.Avatar;
					if (res.data.Avatar) {
						res.data.Avatar = 'http://web-capstone.azurewebsites.net' + oldUrl;
					}
					this.supplier = res.data;
					this.loadingHelperPro.dismissLoading();
				}, (err) => {
					this.loadingHelperPro.dismissLoading();
					console.log(err);
				});
		}
	}

	loadDocument() {
		//get Order Information
		this.postsCol = this.database.collection(this.booking_path, ref => ref.where('OrderId', '==', this.message.OrderId));
		this.posts = this.postsCol.snapshotChanges()
			.map(actions => {
				return actions.map(a => {
					const id = a.payload.doc.id;
					return id;
				});
			});
	}

	cancelOrder(booking) {
		let reason = this.alertCtrl.create({
			title: 'Lý do',
			message: "Hãy điền lý do bạn huỷ đơn hàng",
			inputs: [
				{
					name: 'reason',
					placeholder: 'Nhấn vào đây',
					type: 'text',
					max: 100
				},
			],
			buttons: [
				{
					text: 'Đồng ý',
					handler: data => {
						if (data.reason != null && data.reason != '') {
							this.loadingHelperPro.presentLoading('Đang tải...');
							//Khoi tao object dua vao API
							let objCancel = {
								'OrderId': this.message.OrderId,
								'Reason': data.reason,
								'BookingId': booking
							}
							//Goi API de huy
							this.httpHelperPro.post('/api/cancel-order', objCancel).subscribe(
								(res: any) => {
									if (JSON.parse(res).result == true) {
										// show message
										let toast = this.toastCtrl.create({
											showCloseButton: true,
											closeButtonText: 'OK',
											cssClass: 'profiles-bg',
											message: JSON.parse(res).message,
											duration: 2000,
											position: 'bottom'
										});
										//Turn off message and return to homepage
										setTimeout(() => {
											this.loadingHelperPro.dismissLoading();
											toast.present();
											//Go to result page
											const result = {
												'orderId': this.message.OrderId,
												'cancelReason': data.reason
											};
											this.navCtrl.setRoot('page-cart', {
												'result': result
											});

										}, 2000)
										toast.present();
									}
									if (JSON.parse(res).result == false) {
										// show message
										let toast = this.toastCtrl.create({
											showCloseButton: true,
											closeButtonText: 'OK',
											cssClass: 'profiles-bg',
											message: JSON.parse(res).message,
											duration: 5000,
											position: 'bottom'
										});
										this.loadingHelperPro.dismissLoading();
										toast.present();
										return;
									}
								}
							)
						} else {
							let toast = this.toastCtrl.create({
								message: 'Vui lòng điền lý do',
								duration: 2000,
								position: 'top',
								closeButtonText: 'OK',
								showCloseButton: true
							});
							toast.present();
							return;
						}

					}
				}
			]
		});
		reason.present();
	}

	openCheckoutPage(param) {
		this.navCtrl.push('page-checkout', {'order': param});
	}

	openSupplierDetail() {
		if (this.supplier) {
			this.navCtrl.push('page-supplier-detail',
				{'supplier': this.supplier});
		}
	}

}
