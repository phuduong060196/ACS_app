import { NgModule } from '@angular/core';
import { ServiceCartComponent } from './service-cart/service-cart';
import { ControlMessagesComponent } from './control-messages/control-messages';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload/upload';
@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		ServiceCartComponent,
		ControlMessagesComponent,
    UploadComponent
	],
	exports: [
		ServiceCartComponent,
		ControlMessagesComponent,
    UploadComponent
	]
})
export class ComponentModule { }
