import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BookingServiceDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'page-booking-service-detail',
	segment: 'booking-service-detail',
})
@Component({
  selector: 'page-booking-service-detail',
  templateUrl: 'booking-service-detail.html',
})
export class BookingServiceDetailPage implements OnInit{
	paramId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
	  this.paramId = this.navParams.get('id');
  }

  ngOnInit() {
    console.log('ionViewDidLoad BookingServiceDetailPage');
  }
}
