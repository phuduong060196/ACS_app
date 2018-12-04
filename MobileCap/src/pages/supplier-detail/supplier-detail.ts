import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { GetUrlProvider } from "../../providers/get-url/get-url";
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';
import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';

@IonicPage({
	name: 'page-supplier-detail',
	segment: 'supplier-detail',
})
@Component({
	selector: 'page-supplier-detail',
	templateUrl: 'supplier-detail.html',
})
export class SupplierDetailPage implements OnInit {
	public param: any;
	public supplier: any;
	posts: any;
	public feedbackFlag: boolean;
	public status: boolean;
	services: any;
	feedbacks: any;
	totalFeedback: number;
	supplieropts: String = 'menu';

	constructor(private loadingHelperPro: LoadingHelperProvider, public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public getUrlPro: GetUrlProvider, public toastCtrl: ToastController, public httpHelperPro: HttpHelperProvider, public modalCtrl: ModalController) {
		this.param = this.navParams.get('supplier');
		this.supplier = this.param;
	}

	// loadAllSuppliesById() {
	// 	this.http.get(this.getUrlPro.getUrl + '/api/supplier/get-by-id?id=' + this.paramId)
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

	getSupplierInfo(SupplierId) {
		this.loadingHelperPro.presentLoading('Đang tải...');
		this.httpHelperPro.get('/api/supplier/get-by-id?id=' + SupplierId).subscribe(
			(res: any) => {
				if (res.data.Avatar) {
					let oldUrl = res.data.Avatar;
					res.data.Avatar = 'http://web-capstone.azurewebsites.net' + oldUrl;
				}
				this.supplier = res.data;
				this.loadingHelperPro.dismissLoading();
			},
			(err) => {
				console.log(err);
				this.loadingHelperPro.dismissLoading();
			}
		);
	}

	getServices(SupplierId) {
		this.loadingHelperPro.presentLoading('Đang tải...');
		this.httpHelperPro.get('/api/supplier/search-all-service-by-supplierId?supplierId=' + SupplierId).subscribe(
			(res: any) => {
				this.services = res.data;
				this.loadingHelperPro.dismissLoading();
			},
			(err) => {
				console.log(err);
				this.loadingHelperPro.dismissLoading();
			}
		);
	}

	getFeedback(SupplierId) {
		this.loadingHelperPro.presentLoading('Đang tải...');
		this.httpHelperPro.get('/api/supplier/feedback?supplierId=' + SupplierId).subscribe(
			(res: any) => {
				this.feedbacks = res.feedbacks;
				this.totalFeedback = res.totalFeedback;
				this.loadingHelperPro.dismissLoading();
			},
			(err) => {
				console.log(err);
				this.loadingHelperPro.dismissLoading();
			}
		);
	}

	openBookingServiceDetail() {
		let modal = this.modalCtrl.create('page-booking-service-detail', {
			'supplier': this.supplier
		});
		modal.present();
		// this.navCtrl.push('page-booking-service-detail', {
		// 	'supplier': this.supplier
		// })
	}

	openChatDetail(param) {
		this.navCtrl.push('page-chat-detail', { 'id': param });
	}

	openFeedbackDetail(param) {
		let modal = this.modalCtrl.create('page-feedback-detail', { 'id': param });
		modal.present();
		// this.navCtrl.push('page-feedback-detail', {'id': param});
	}

	ngOnInit() {
		if (this.param) {
			this.getSupplierInfo(this.param.SupplierId);
			this.getServices(this.param.SupplierId);
			this.getFeedback(this.param.SupplierId);
			this.checkTransactionHistory();
		}
	}

}
