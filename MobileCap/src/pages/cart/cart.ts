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

    constructor(private httpHelperPro: HttpHelperProvider, private loadingHelperPro: LoadingHelperProvider, private accessTokenHelperPro: AccessTokenHelperProvider, public navCtrl: NavController, public navParams: NavParams) {

    }

    ngOnInit() {
        this.accessTokenHelperPro.GetAccessToken.subscribe(val => {
            if (localStorage.getItem('token')) {
                this.customerId = JSON.parse(localStorage.getItem('token')).CustomerId;
                this.loadingHelperPro.presentLoading('');
                this.httpHelperPro.get('/api/order/get-all-order?customerId=' + this.customerId).subscribe(
                    (res: any) => {
                        console.log(res);
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

}
