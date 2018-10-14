import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
// import { PipesModule } from '../../pipes/pipes.module';
import { FavoriteDishPage } from './favorite-dish';

@NgModule({
	declarations: [
		FavoriteDishPage
	],
	imports: [
		IonicPageModule.forChild(FavoriteDishPage)
	],
	exports: [
		FavoriteDishPage
	]
})

export class FavoriteDishPageModule { }
