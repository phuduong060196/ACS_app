import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core';

import { NearbyPage } from './nearby';

@NgModule({
	declarations: [
		NearbyPage
	],
	imports: [
		IonicPageModule.forChild(NearbyPage),
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
		})
	],
	exports: [
		NearbyPage
	]
})

export class NearbyPageModule { }
