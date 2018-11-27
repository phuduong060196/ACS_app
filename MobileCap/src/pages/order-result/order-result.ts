import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpHelperProvider} from "../../providers/http-helper/http-helper";
import {LoadingHelperProvider} from "../../providers/loading-helper/loading-helper";

/**
 * Generated class for the OrderResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'page-order-result',
	segment: 'order-result'
})
@Component({
	selector: 'page-order-result',
	templateUrl: 'order-result.html',
})
export class OrderResultPage implements OnInit{
	private result: any;
	order: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, private httpHelperPro: HttpHelperProvider, private loadingHelperPro: LoadingHelperProvider) {
		this.result = this.navParams.get('result');
		this.loadingHelperPro.presentLoading('Đang tải...');
	}

	getOrderInfo(){
		if(this.result){
			this.loadingHelperPro.presentLoading('Đang tải...');
			this.httpHelperPro.get('/api/order/order-detail?orderId='+this.result.orderId).subscribe(
				(res: any) => {
					this.order = res.order;
					console.log(this.order);
					this.loadingHelperPro.dismissLoading();
				},
				(err) => {
					console.log(err);
					this.loadingHelperPro.dismissLoading();
				}
			)
		}
	}

	closeModal() {
		this.navCtrl.pop();
	}

	ngOnInit(): void {
		this.getOrderInfo();
	}

}
