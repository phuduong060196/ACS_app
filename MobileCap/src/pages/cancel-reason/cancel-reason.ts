import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CancelReasonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'page-cancel-reason',
	segment: 'cancel-reason'
})
@Component({
  selector: 'page-cancel-reason',
  templateUrl: 'cancel-reason.html',
})
export class CancelReasonPage {
	private order:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.order = this.navParams.get('order');
  }

  ionViewDidLoad() {
  }

  closeModal(){
  	this.navCtrl.pop();
  }

}
