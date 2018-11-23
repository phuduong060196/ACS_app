import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthPage } from './auth';
import { ComponentModule } from '../../components/components.module';

@NgModule({
	declarations: [
		AuthPage
	],
	imports: [
		IonicPageModule.forChild(AuthPage),
		ComponentModule
	],
	exports: [
		AuthPage
	]
})

export class AuthPageModule { }
