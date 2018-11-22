import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PaymentSuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'page-payment-success',
	segment: 'payment-success'
})
@Component({
  selector: 'page-payment-success',
  templateUrl: 'payment-success.html',
})
export class PaymentSuccessPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentSuccessPage');
  }

}
