import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

    constructor(private httpHelperPro: HttpHelperProvider, private loadingHelperPro: LoadingHelperProvider, private accessTokenHelperPro: AccessTokenHelperProvider, public navCtrl: NavController, public navParams: NavParams) {

    }

    ngOnInit() {
        this.accessTokenHelperPro.GetAccessToken.subscribe(val => {
            const token = localStorage.getItem('token');
            if (token) {
                this.customerId = JSON.parse(token).CustomerId;
                this.loadingHelperPro.presentLoading('');
                this.httpHelperPro.get('/api/order/get-all-order?customerId=' + this.customerId).subscribe(
                    (res: any) => {
                        console.log(res);
                        this.history = res.data;
                        this.listPending = this.history
                            .filter(el => el.OrderStatus === 'Đang xử lí')
                            .map(el => { return el; });
                        this.listFinished = this.history
                            .filter(el => (el.OrderStatus === 'Hoàn tất' || el.OrderStatus === 'Hủy'))
                            .map(el => { return el; });
                        console.log(this.listPending);
                        console.log(this.listFinished);
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

    openHistoryDetail(history) {
        console.log(history);
        this.navCtrl.push('page-order-detail', {
            'message': history
        });
    }

}
