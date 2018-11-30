import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewBookingPage } from './review-booking';

@NgModule({
  declarations: [
    ReviewBookingPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewBookingPage),
  ],
})
export class ReviewBookingPageModule {}
