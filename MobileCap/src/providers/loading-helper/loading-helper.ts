import { Injectable } from '@angular/core';
import { LoadingController } from "ionic-angular";

@Injectable()
export class LoadingHelperProvider {

  private loading: any;

  constructor(public loadingCtrl: LoadingController) {

  }
  presentLoading(text) {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        spinner: 'circles',
        content: text
      });
      this.loading.present();
    }
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
}
