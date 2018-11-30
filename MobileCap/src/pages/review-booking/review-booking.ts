import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ReviewBookingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'page-review-booking',
  segment: 'review-booking'
})
@Component({
  selector: 'page-review-booking',
  templateUrl: 'review-booking.html',
})
export class ReviewBookingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewBookingPage');
  }

}
