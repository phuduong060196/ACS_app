import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceListPage } from './service-list';

@NgModule({
  declarations: [
    ServiceListPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceListPage),
  ],
})
export class ServiceListPageModule {}
