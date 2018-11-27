import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
	name: 'page-message-detail',
	segment: 'message/:id'
})

@Component({
  selector: 'page-message-detail',
  templateUrl: 'message-detail.html'
})

export class MessageDetailPage {
	message: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.message = this.navParams.get('message');
  	if(this.message){

    }
  }

}
