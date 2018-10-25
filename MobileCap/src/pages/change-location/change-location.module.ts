import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeLocationPage } from './change-location';

@NgModule({
  declarations: [
    ChangeLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeLocationPage),
  ],
})
export class ChangeLocationPageModule {}
