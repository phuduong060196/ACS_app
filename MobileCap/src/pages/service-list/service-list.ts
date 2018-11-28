import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';
import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';

@IonicPage({
  name: 'page-service-list',
  segment: 'service-list'
})

@Component({
  selector: 'page-service-list',
  templateUrl: 'service-list.html',
})
export class ServiceListPage implements OnInit {

  type: any;
  services: any;

  constructor(private loadingHelperPro: LoadingHelperProvider, private httpHelperPro: HttpHelperProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.type = this.navParams.get('type');
  }

  ngOnInit() {
    this.loadAllService();
  }

  loadAllService() {
    if (this.type) {
      this.loadingHelperPro.presentLoading('Đang tải...');
      this.httpHelperPro.get('/api/service/get-all-by-type-id?serviceTypeId=' + this.type.ServiceTypeId).subscribe(
        (res: any) => {
          console.log(res);
          this.services = res;
          this.loadingHelperPro.dismissLoading();
        },
        (err) => {

          this.loadingHelperPro.dismissLoading();
        }
      );
    }
  }

}
