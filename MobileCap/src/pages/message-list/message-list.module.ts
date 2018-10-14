import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageListPage } from './message-list';

@NgModule({
	declarations: [
		MessageListPage
	],
	imports: [
		IonicPageModule.forChild(MessageListPage)
	],
	exports: [
		MessageListPage
	]
})

export class MessageListPageModule { }
