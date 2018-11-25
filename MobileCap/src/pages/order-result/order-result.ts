import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

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
export class OrderResultPage {
	private result: any;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.result = this.navParams.get('result');
	}

	ionViewDidLoad() {

	}

	closeModal() {
		this.navCtrl.pop();
	}

}
