import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import {AgmCoreModule} from "@agm/core";

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
	  AgmCoreModule.forRoot({
		  apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
	  })
  ],
	exports:[
		SearchPage
	]
})
export class SearchPageModule {}
