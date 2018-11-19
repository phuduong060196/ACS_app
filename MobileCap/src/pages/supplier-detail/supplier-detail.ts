import {Component, OnInit} from '@angular/core';
import { IonicPage, ActionSheetController, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {GetUrlProvider} from "../../providers/get-url/get-url";
import 'rxjs/add/operator/map';
import { RestaurantService } from '../../providers/restaurant-service-mock';
import { DishService } from '../../providers/dish-service-mock';
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';

/**
 * Generated class for the SupplierDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface Post {
	isAccept: any;
	message: string;
}

@IonicPage({
	name: 'page-supplier-detail',
	segment: 'supplier-detail',
})
@Component({
	selector: 'page-supplier-detail',
	templateUrl: 'supplier-detail.html',
})
export class SupplierDetailPage implements OnInit {
	public param: number;
	public supplier: any;
	posts: any;
	public feedbackFlag: boolean;
	public status: boolean;
	supplierAvatar: string;
	services: any;
	feedbacks: any;
	supplieropts: String = 'menu';

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public getUrlPro: GetUrlProvider, public toastCtrl: ToastController, public httpHelperPro: HttpHelperProvider, public modalCtrl: ModalController) {
		this.param = this.navParams.get('supplier');
		this.supplier = this.param;
		this.supplierAvatar = "http://web-capstone.azurewebsites.net/" + this.supplier.Avatar;

	}

	// loadAllSuppliesById() {
	// 	this.http.get(this.getUrlPro.getUrl + '/api/supplier/get-by-id?id=' + this.param)
	// 		.subscribe((res: any) => {
	// 			this.supplier = res.data;
	// 			this.supplierAvatar = "http://web-capstone.azurewebsites.net/" + this.supplier.Avatar;
	// 		}, (err) => {
	// 			console.log(err);
	// 		});
	// }

	checkTransactionHistory() {
		//get UserID
		let customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		//get SupplierID
		let supplierId = this.supplier.SupplierId;
		this.http.get(this.getUrlPro.getUrl + '/api/supplier/check-has-order-with-supplier?customerId=' + customerId + '&supplierId=' + supplierId)
			.subscribe((res: any) => {
				this.feedbackFlag = res.data;
			}, (err) => {
				console.log(err);
			});

	}

	getServices(SupplierId) {
		this.httpHelperPro.get('/api/supplier/search-all-service-by-supplierId?supplierId=' + SupplierId).subscribe(
			(res: any) => {
				console.log(res.data);
				this.services = res.data;
			},
			(err) => {
				console.log(err);
			}
		);
	}

	getFeedback(SupplierId) {
		this.httpHelperPro.get('/api/supplier/feedback?supplierId=' + SupplierId).subscribe(
			(res: any) => {
				this.feedbacks = res.feedbacks;
			},
			(err) => {
				console.log(err);
			}
		);
	}

	openBookingServiceDetail() {
		let modal = this.modalCtrl.create('page-booking-service-detail', {
			'supplier': this.supplier
		});
		modal.present();
	}

	openChatDetail(param) {
		this.navCtrl.push('page-chat-detail', {'id': param});
	}

	openFeedbackDetail(param) {
		this.navCtrl.push('page-feedback-detail', {'id': param});
	}

	ngOnInit(): void {
		if (!this.supplier) {
			this.navCtrl.push('page-home');
			return;
		}
		if (this.supplier) {
			this.getServices(this.supplier.SupplierId);
			this.getFeedback(this.supplier.SupplierId);
			this.checkTransactionHistory();
		}
	}

}
