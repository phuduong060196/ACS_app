import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupplierDetailPage } from './supplier-detail';

@NgModule({
  declarations: [
    SupplierDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SupplierDetailPage),
  ],
})
export class SupplierDetailPageModule {}
