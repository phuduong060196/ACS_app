
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, DateTime, ModalController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';
import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';
import moment from 'moment';
import { AccessTokenHelperProvider } from '../../providers/access-token-helper/access-token-helper';
import { CloseModalProvider } from '../../providers/close-modal/close-modal';

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
	Note: any = '';
	TimeWork: any = '';
	DayWork: any = '';
	MinDayWork = new Date().toISOString();
	currentDateMoment = moment(new Date()).utc().format();
	MaxDayWork = moment(this.currentDateMoment).add(14, 'd').toISOString();
	isCloseModal: any;

	constructor(private closeModalPro: CloseModalProvider, private modalCtrl: ModalController, private accessTokenHelperPro: AccessTokenHelperProvider, private loadingHelperPro: LoadingHelperProvider, public navCtrl: NavController, public navParams: NavParams, public database: AngularFirestore, public httpHelperPro: HttpHelperProvider, private alertCtrl: AlertController) {

	}

	ionViewDidLoad() {
		this.closeModalPro.GetIsCloseModal.subscribe(
			(val) => {
				this.isCloseModal = val;
				if (this.isCloseModal) {
					this.closeModal();
				}
			}
		);c
	}

	ngOnInit() {

		console.log(new Date().toISOString());

		this.closeModalPro.SetIsCloseModal = false;
		this.isCloseModal = false;

		this.supplier = this.navParams.get('supplier');
		if (!this.supplier) {
			this.navCtrl.push('page-home');
			return;
		}

		if (localStorage.getItem('token')) {
			this.customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
			this.getCustomer(this.customerId);
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
						element2.Quantity = 1
					});
					return element1;
				});
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
				console.log(res);
				this.customer = res;
				this.loadingHelperPro.dismissLoading();
			},
			(err) => {
				console.log(err);
				this.loadingHelperPro.dismissLoading();
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

	goToReViewBooking() {
		var inforBooking = {};
		let list: any = [];

		this.services.forEach(element1 => {
			element1.Services.forEach(element2 => {
				if (element2.checked == true) {
					list.push({
						ServiceId: element2.ServiceId,
						Price: element2.Price,
						PriceDisplay: element2.PriceDisplay,
						Name: element2.Name,
						Quantity: element2.Quantity
					});
				}
			});
		});

		if (this.customer.FullName != '' && this.customer.PhoneNumber != '' && this.customer.Address != '' && this.DayWork != '' && this.TimeWork != '') {
			if (list.length > 0) {

				let dayTime: any = moment(this.DayWork + ' ' + this.TimeWork, 'YYYY-MM-DD HH:mm');

				inforBooking = {
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
					'SeenBySupplier': false,
					'Time': new Date(),
					'CustomerName': this.customer.FullName,
					'PhoneNumber': this.customer.PhoneNumber,
					'Address': this.customer.Address,
					'DayWork': dayTime._d,
					'Note': this.Note
				}

				this.modalCtrl.create('page-review-booking', {
					'inforBooking': inforBooking
				}).present();

			} else {
				let alert = this.alertCtrl.create({
					title: 'Thông báo',
					message: 'Vui lòng chọn dịch vụ để đặt lịch!',
					buttons: ['Xác nhận']
				});
				alert.present();
			}
		} else {
			let alert = this.alertCtrl.create({
				title: 'Thông báo',
				message: 'Vui lòng nhập đầy đủ thông tin mục có *!',
				buttons: ['Xác nhận']
			});
			alert.present();
		}
	}

	plusQuantity(el) {
		el.Quantity++;
	}

	minusQuantity(el) {
		el.Quantity--;
	}
}

