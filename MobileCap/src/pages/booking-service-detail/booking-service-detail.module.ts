import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingServiceDetailPage } from './booking-service-detail';

@NgModule({
    declarations: [
        BookingServiceDetailPage
    ],
    imports: [
        IonicPageModule.forChild(BookingServiceDetailPage),
    ],
    exports: [
        BookingServiceDetailPage
    ]
})
export class BookingServiceDetailPageModule { }
