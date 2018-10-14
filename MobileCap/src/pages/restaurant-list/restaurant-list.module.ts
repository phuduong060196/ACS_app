import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantListPage } from './restaurant-list';

import { AgmCoreModule } from '@agm/core';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		RestaurantListPage
	],
	imports: [
		IonicPageModule.forChild(RestaurantListPage),
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
		}),
		PipesModule
	],
	exports: [
		RestaurantListPage
	]
})

export class RestaurantListPageModule { }
