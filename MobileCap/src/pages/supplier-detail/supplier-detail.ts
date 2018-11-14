import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {GetUrlProvider} from "../../providers/get-url/get-url";
import 'rxjs/add/operator/map';

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

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public getUrlPro: GetUrlProvider) {
		this.param = this.navParams.get('id');
	}

	loadAllSuppliesById() {
		this.http.get(this.getUrlPro.getUrl + '/api/supplier/get-by-id?id=' + this.param)
			.subscribe((res: any) => {
				this.supplier = res.data;
				this.supplierAvatar = "http://web-capstone.azurewebsites.net/" + this.supplier.Avatar;
			}, (err) => {
				console.log(err);
			});
	}

	checkTransactionHistory() {
		//get UserID
		let customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		//get SupplierID
		let supplierId = this.param;
		this.http.get(this.getUrlPro.getUrl + '/api/supplier/check-has-order-with-supplier?customerId=' + customerId + '&supplierId=' + supplierId)
			.subscribe((res: any) => {
				this.feedbackFlag = res.data;
			}, (err) => {
				console.log(err);
			});

	}

	openChatDetail(param) {
		this.navCtrl.push('page-chat-detail', {'id': param});
	}

	openBookingService(param) {
		this.navCtrl.push('page-booking-service-detail', {'id': param});
	}


	openFeedbackDetail(param) {
		this.navCtrl.push('page-feedback-detail', {'id': param});
	}

	ngOnInit(): void {
		if (this.param == null) {
			this.navCtrl.push('page-supplier-list');
		}
		this.loadAllSuppliesById();
		this.checkTransactionHistory();
	}

}
