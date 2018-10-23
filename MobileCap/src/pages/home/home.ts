import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, MenuController, ToastController, PopoverController, ModalController } from 'ionic-angular';

import { RestaurantService } from '../../providers/restaurant-service-mock';
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';
import { SupplierServiceProvider } from '../../providers/supplier-service/supplier-service';
import {SupplierListPage} from "../supplier-list/supplier-list";

@IonicPage({
  name: 'page-home',
  segment: 'home',
  priority: 'high'
})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  restaurants: Array<any>;
  suppliers: any;
  lat: number = 42.35663;
  lng: number = -71.11095;

  searchKey: string = '';
  yourLocation: string = "123 Cộng Hòa, F12, Q. Tân Bình, Tp. HCM";

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public locationCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, public service: RestaurantService, public httpHelperPro: HttpHelperProvider, public supplierServicePro: SupplierServiceProvider) {
    this.menuCtrl.swipeEnable(true, 'authenticated');
    this.menuCtrl.enable(true);
    this.getAllSuppliers();
  }

  openSupplierList() {
	  this.navCtrl.push('page-supplier-list');
  }

  openRestaurantFilterPage() {
    let modal = this.modalCtrl.create('page-restaurant-filter');
    modal.present();
  }

  openNearbyPage() {
    this.navCtrl.push('page-nearby');
  }

  openOrders() {
    this.navCtrl.push('page-orders');
  }

  openCart() {
    this.navCtrl.push('page-cart');
  }

  openRestaurantDetail(supplier: any) {
    this.navCtrl.push('page-restaurant-detail', {
      'supplier': supplier
    });
  }

  openSettingsPage() {
    this.navCtrl.push('page-settings');
  }

  openNotificationsPage() {
    this.navCtrl.push('page-notifications');
  }

  openCategoryPage() {
    this.navCtrl.push('page-category');
  }

  onInput(event) {
    console.log(event.data);
  }

  onCancel(event) {

  }

  getAllSuppliers() {
    this.httpHelperPro.get('/api/supplier/search?name=&searchBy=price&sort=desc').subscribe(
      (res: any) => {
        this.suppliers = res.data;
        console.log(this.suppliers);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  search(event) {
    console.log(event.target.value);
    this.httpHelperPro.get('/api/supplier/search?name=' + event.target.value + '&searchBy=price&sort=desc').subscribe(
      (res: any) => {
        this.suppliers = res.data;
        console.log(this.suppliers);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  alertLocation() {
    let changeLocation = this.locationCtrl.create({
      title: 'Đổi vị trí',
      inputs: [
        {
          name: 'location',
          placeholder: 'Nhập vị trí',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Hủy',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Xác nhận',
          handler: data => {
            console.log('Change clicked', data);
            this.yourLocation = data.location;
            let toast = this.toastCtrl.create({
              message: 'Đổi thành công',
              duration: 3000,
              position: 'top',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    changeLocation.present();
  }

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create('page-notifications');
    popover.present({
      ev: myEvent
    });
  }

  ionViewWillEnter() {
    this.navCtrl.canSwipeBack();
  }

}
