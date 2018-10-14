import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {CategoryService} from '../../providers/category-service-mock';

@IonicPage({
	name: 'page-category',
	segment: 'category'
})

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

	categories: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public service: CategoryService) {
  	this.findAll();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

	findAll() {
	    this.service.findAll()
	        .then(data => this.categories = data)
	        .catch(error => alert(error));
	}

  openRestaurantListPage(proptype) {
  	this.navCtrl.push('page-restaurant-list', {'proptype': proptype});
  }

}
