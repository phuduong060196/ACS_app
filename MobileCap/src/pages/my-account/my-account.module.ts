import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAccountPage } from './my-account';
import { ComponentModule } from '../../components/components.module';

@NgModule({
	declarations: [
		MyAccountPage
	],
	imports: [
		IonicPageModule.forChild(MyAccountPage),
		ComponentModule
	],
	exports: [
		MyAccountPage
	]
})

export class MyAccountPageModule { }
