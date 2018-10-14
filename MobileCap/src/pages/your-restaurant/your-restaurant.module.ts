import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YourRestaurantPage } from './your-restaurant';

@NgModule({
	declarations: [
		YourRestaurantPage
	],
	imports: [
		IonicPageModule.forChild(YourRestaurantPage)
	],
	exports: [
		YourRestaurantPage
	]
})

export class YourRestaurantPageModule { }
