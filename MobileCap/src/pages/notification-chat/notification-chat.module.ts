import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationChatPage } from './notification-chat';

@NgModule({
  declarations: [
    NotificationChatPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationChatPage),
  ],
})
export class NotificationChatPageModule {}
