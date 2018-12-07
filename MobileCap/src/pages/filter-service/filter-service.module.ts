import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterServicePage } from './filter-service';

@NgModule({
  declarations: [
    FilterServicePage,
  ],
  imports: [
    IonicPageModule.forChild(FilterServicePage),
  ],
})
export class FilterServicePageModule {}
