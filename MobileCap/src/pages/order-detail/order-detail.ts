import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';

@IonicPage({
  name: 'page-order-detail',
  segment: 'order-detail'
})
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage implements OnInit {

  message: any;
  order: any;
  services: any;
  customerInfo: any;

  constructor(private httpHelperPro: HttpHelperProvider, private loadingHelperPro: LoadingHelperProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.message = this.navParams.get('message');
  }

  ngOnInit() {
    if (this.message) {
      this.loadingHelperPro.presentLoading('');
      this.httpHelperPro.get('/api/order/order-detail?orderId=' + this.message.OrderId).subscribe(
        (res: any) => {
          this.loadingHelperPro.dismissLoading();
          this.order = res.order;
          this.services = this.order.OrderDetails;
          this.customerInfo = res.customerInfo;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

}
