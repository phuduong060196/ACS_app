import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DishDetailPage } from './dish-detail';

@NgModule({
	declarations: [
		DishDetailPage
	],
	imports: [
		IonicPageModule.forChild(DishDetailPage)
	],
	exports: [
		DishDetailPage
	]
})

export class DishDetailPageModule { }
