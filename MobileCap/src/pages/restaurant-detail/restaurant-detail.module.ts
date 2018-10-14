import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core';
import { RestaurantDetailPage } from './restaurant-detail';

@NgModule({
	declarations: [
		RestaurantDetailPage
	],
	imports: [
		IonicPageModule.forChild(RestaurantDetailPage),
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
		})
	],
	exports: [
		RestaurantDetailPage
	]
})

export class RestaurantDetailPageModule { }
