import { NgModule } from '@angular/core';
import { ServiceCartComponent } from './service-cart/service-cart';
import { ControlMessagesComponent } from './control-messages/control-messages';
import { CommonModule } from '@angular/common';
@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		ServiceCartComponent,
		ControlMessagesComponent,
	],
	exports: [
		ServiceCartComponent,
		ControlMessagesComponent,
	]
})
export class ComponentModule { }
