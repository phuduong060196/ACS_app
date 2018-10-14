import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
	name: 'page-support',
	segment: 'support'
})

@Component({
    selector: 'page-support',
    templateUrl: 'support.html'
})
export class SupportPage {

  constructor(public navCtrl: NavController) {

  }

}
