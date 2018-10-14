import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantFilterPage } from './restaurant-filter';

@NgModule({
	declarations: [
		RestaurantFilterPage
	],
	imports: [
		IonicPageModule.forChild(RestaurantFilterPage)
	],
	exports: [
		RestaurantFilterPage
	]
})

export class RestaurantFilterPageModule { }
