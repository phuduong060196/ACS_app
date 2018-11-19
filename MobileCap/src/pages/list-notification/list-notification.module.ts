import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListNotificationPage } from './list-notification';

@NgModule({
  declarations: [
    ListNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(ListNotificationPage),
  ],
})
export class ListNotificationPageModule {}
