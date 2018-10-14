import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DishListPage } from './dish-list';

@NgModule({
	declarations: [
		DishListPage
	],
	imports: [
		IonicPageModule.forChild(DishListPage)
	],
	exports: [
		DishListPage
	]
})

export class DishListPageModule { }
