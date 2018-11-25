import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CancelReasonPage } from './cancel-reason';

@NgModule({
  declarations: [
    CancelReasonPage,
  ],
  imports: [
    IonicPageModule.forChild(CancelReasonPage),
  ],
})
export class CancelReasonPageModule {}
