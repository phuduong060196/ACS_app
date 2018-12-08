import { Component, OnInit } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { AccessTokenHelperProvider } from '../../providers/access-token-helper/access-token-helper';
import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';

@IonicPage({
    name: 'page-cart',
    segment: 'cart'
})

@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html',
})

export class CartPage implements OnInit {

    currentType: string = 'Pending';
    customerId: any;
    history: any;
    listPending: any;
    listFinished: any;
    orderResult: any;

    constructor(private httpHelperPro: HttpHelperProvider, private loadingHelperPro: LoadingHelperProvider, private accessTokenHelperPro: AccessTokenHelperProvider, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
		this.orderResult = this.navParams.get('result');
    }

    loadAllHistory(){
		this.accessTokenHelperPro.GetAccessToken.subscribe(val => {
			const token = localStorage.getItem('token');
			if (token) {
				this.customerId = JSON.parse(token).CustomerId;
				this.loadingHelperPro.presentLoading('Đang tải...');
				this.httpHelperPro.get('/api/order/get-all-order?customerId=' + this.customerId).subscribe(
					(res: any) => {
						this.history = res.data;
						this.listPending = this.history
							.filter(el => el.OrderStatusId === 1)
							.map(el => { return el; });
							console.log(this.listPending);
						this.listFinished = this.history
							.filter(el => (el.OrderStatusId === 2 || el.OrderStatusId === 3))
							.map(el => { return el; });
						this.loadingHelperPro.dismissLoading();
					},
					(err) => {
						console.log(err);
						this.loadingHelperPro.dismissLoading();
					}
				);
			}
		});
	}

	openOrderResult(){
		if(this.orderResult){
			let modal = this.modalCtrl.create('page-order-result', {'result': this.orderResult});
			modal.present();
		}
	}

    ngOnInit() {
        this.loadAllHistory();
        this.openOrderResult();
    }

    openHistoryDetail(history) {
        this.navCtrl.push('page-order-detail', {
            'message': history
        });
    }

}
