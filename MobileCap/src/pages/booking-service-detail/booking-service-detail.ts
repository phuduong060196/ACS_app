
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';

/**
 * Generated class for the BookingServiceDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

	constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFirestore, public httpHelperPro: HttpHelperProvider, private alertCtrl: AlertController) {

	}

	sendBookingRequest() {
		const list = this.services.filter(el => el.checked == true).map(el => {
			return {
				ServiceId: el.ServiceId,
				Price: el.Price,
				PriceDisplay: el.PriceDisplay,
				Name: el.Name
			}
		})
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
				'Address': this.customer.Address,
				'PhoneNumber': this.customer.PhoneNumber
			});
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
		this.supplier = this.navParams.get('supplier');
		if (!this.supplier) {
			this.navCtrl.push('page-home');
			return;
		}
		this.customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		if (this.customerId) {
			console.log(this.customerId);
			this.getCustomer(this.customerId);
		}
		if (this.supplier) {
			this.supplierId = this.supplier.SupplierId;
			this.getServices(this.supplier.SupplierId);
		}
	}

	getServices(SupplierId) {
		this.httpHelperPro.get('/api/supplier/search-all-service-by-supplierId?supplierId=' + SupplierId).subscribe(
			(res: any) => {
				console.log(res.data);
				this.services = res.data.map(el => {
					el.checked = false;
					return el;
				});
			},
			(err) => {
				console.log(err);
			}
		);
	}

	getCustomer(CustomerId) {
		console.log(CustomerId);
		this.httpHelperPro.get('/api/customer/get-info?customerId=' + CustomerId).subscribe(
			(res: any) => {
				console.log(res);
				this.customer = res.data;
			},
			(err) => {
				console.log(err);
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

