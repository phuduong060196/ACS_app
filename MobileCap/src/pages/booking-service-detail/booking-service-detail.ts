
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';
import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';
import moment from 'moment';

interface Post {
	SeenBySupplier: any;
	CurrentStatus: any;
}

@IonicPage({
	name: 'page-booking-service-detail',
	segment: 'booking-service-detail',
})
@Component({
	selector: 'page-booking-service-detail',
	templateUrl: 'booking-service-detail.html',
})
export class BookingServiceDetailPage implements OnInit {
	supplier: any;
	services: any;
	customerId: any;
	customer: any;
	supplierId: any;
	postsCol: AngularFirestoreCollection<Post>;
	posts: any;
	private booking_path = 'booking';
	currentTime: any;
	currentDay: any;
	maxMonth: any;
	Note: any = 'a';
	TimeWork: any = moment().format('HH:mm');
	DayWork: any = moment().format('MM-DD-YYYY');

	constructor(private loadingHelperPro: LoadingHelperProvider, public navCtrl: NavController, public navParams: NavParams, public database: AngularFirestore, public httpHelperPro: HttpHelperProvider, private alertCtrl: AlertController) {

	}

	sendBookingRequest() {
		// console.log(this.services);
		// const list = this.services.filter(el => el.checked == true).map(el => {
		// 	return {
		// 		ServiceId: el.ServiceId,
		// 		Price: el.Price,
		// 		PriceDisplay: el.PriceDisplay,
		// 		Name: el.Name
		// 	}
		// })

		let list: any = [];

		this.services.forEach(element1 => {
			element1.Services.forEach(element2 => {
				if (element2.checked == true) {
					list.push({
						ServiceId: element2.ServiceId,
						Price: element2.Price,
						PriceDisplay: element2.PriceDisplay,
						Name: element2.Name
					});
				}
			});
		});

		if (list.length > 0) {
			this.database.collection(this.booking_path).add({
				'CurrentStatus': {
					'CreatedByCustomer': true,
					'Name': "Waiting for review",
					'UpdatedDate': new Date()
				},
				'CustomerId': this.customerId,
				'SupplierId': this.supplierId,
				'Order': {
					'OrderDetails': list
				},
				'SeenByCustomer': false,
				'Time': new Date(),
				'CustomerName': this.customer.FullName,
				'PhoneNumber': this.customer.PhoneNumber,
				'Address': this.customer.Address,
				'DayWork': this.DayWork,
				'TimeWork': this.TimeWork,
				'Note': this.Note
			});
			let alert = this.alertCtrl.create({
				title: 'Thông báo',
				message: 'Đặt dịch vụ thành công!',
				buttons: [{
					text: 'Xác nhận',
					handler: () => {
						this.closeModal();
					}
				}]
			});
			alert.present();
		} else {
			let alert = this.alertCtrl.create({
				title: 'Thông báo',
				message: 'Vui lòng chọn dịch vụ để đặt lịch!',
				buttons: ['Xác nhận']
			});
			alert.present();
		}
	}

	ngOnInit() {
		this.currentTime = moment().format('HH:mm');
		this.currentDay = moment().format('DDMMYYYY');
		this.maxMonth = moment().add(1, 'M').format('DDMMYYYY');
		console.log(this.currentDay + ' ' + this.maxMonth);
		this.supplier = this.navParams.get('supplier');
		if (!this.supplier) {
			this.navCtrl.push('page-home');
			return;
		}
		this.customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		if (this.customerId) {
			console.log(this.customerId);
			this.getCustomer(this.customerId);
			console.log(this.customer);
		}
		if (this.supplier) {
			this.supplierId = this.supplier.SupplierId;
			this.getServices(this.supplier.SupplierId);
		}
	}

	getServices(SupplierId) {
		this.loadingHelperPro.presentLoading('');
		this.httpHelperPro.get('/api/supplier/search-all-service-by-supplierId?supplierId=' + SupplierId).subscribe(
			(res: any) => {
				this.services = res.data.map(element1 => {
					element1.Services.map(element2 => {
						element2.checked = false;
					});
					return element1;
				});
				console.log(this.services);
				this.loadingHelperPro.dismissLoading();
			},
			(err) => {
				console.log(err);
				this.loadingHelperPro.dismissLoading();
			}
		);
	}

	getCustomer(CustomerId) {
		this.loadingHelperPro.presentLoading('');
		this.httpHelperPro.get('/api/customer/get-info?customerId=' + CustomerId).subscribe(
			(res: any) => {
				this.customer = res;
				this.loadingHelperPro.presentLoading('');
			},
			(err) => {
				console.log(err);
				this.loadingHelperPro.presentLoading('');
			}
		);
	}

	checkNotify() {
		this.postsCol = this.database.collection(this.booking_path, ref =>
			ref.where('CurrentStatus.CreatedByCustomer', '==', true));
		this.posts = this.postsCol.valueChanges();
		console.log('test');
		;
	}

	closeModal() {
		this.navCtrl.pop();
	}
}

