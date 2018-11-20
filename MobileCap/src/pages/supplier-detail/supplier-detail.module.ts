import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core';
import { SupplierDetailPage } from './supplier-detail';

@NgModule({
  declarations: [
    SupplierDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SupplierDetailPage),
	  AgmCoreModule.forRoot({
		  apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
	  })
  ],
	exports: [
		SupplierDetailPage
	]
})
export class SupplierDetailPageModule {}
