import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, MenuController, ToastController, PopoverController, ModalController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';

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
  suppliersNearby: any;
  lat: number;
  lng: number;
  administrative_area_level_1: any;
  administrative_area_level_2: any;

  searchKey: string;
  yourLocation: string;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public locationCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, public service: RestaurantService, public httpHelperPro: HttpHelperProvider, public supplierServicePro: SupplierServiceProvider, private platform: Platform, private geolocation: Geolocation, private http: HttpClient) {
    this.menuCtrl.swipeEnable(true, 'authenticated');
    this.menuCtrl.enable(true);
    this.getCurrentLocal();
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

  getCurrentLocal() {
    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then(res => {
        this.lat = res.coords.latitude;
        this.lng = res.coords.longitude;
        this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + res.coords.latitude + ',' + res.coords.longitude + '&key=AIzaSyDr5qwgemJp4LtodR8lvXg382V-cDFK3bY&sensor=false')
          .subscribe(
            (result: any) => {
              result.results[1].address_components.forEach(element => {
                if (element.types[0] == "administrative_area_level_1") {
                  this.administrative_area_level_1 = element.long_name
                }
                if (element.types[0] == "administrative_area_level_2") {
                  this.administrative_area_level_2 = element.long_name
                }
              });
              this.yourLocation = result.results[1].formatted_address
              this.http.get('http://web-capstone.azurewebsites.net/api/location/search-location?district=Quận ' + this.administrative_area_level_2 + '&city=' + this.administrative_area_level_1)
                .subscribe(
                  (res: any) => {
                    this.suppliersNearby = res;
                    this.suppliersNearby.forEach(supplier => {
                      let distance = this.getDistanceFromLatLonInKm(this.lat, this.lng, supplier.Branches[0].Latitude, supplier.Branches[0].Longitude);
                      supplier.distance = distance.toFixed(2);
                    });
                    this.suppliersNearby = this.suppliersNearby.sort(this.compareObj);
                    console.log(this.suppliersNearby);
                  },
                  (err) => {
                    console.log(err);
                  }
                )
            }
          )
      })
    });
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  compareObj(a, b) {
    if (a.distance < b.distance) {
      return -1;
    }
    if (a.distance > b.distance) {
      return 1;
    }
    return 0;
  }
}
