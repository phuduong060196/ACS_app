import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, MenuController, ToastController, PopoverController, ModalController } from 'ionic-angular';

import {RestaurantService} from '../../providers/restaurant-service-mock';

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
  searchKey: string = "";
  yourLocation: string = "123 Cộng Hòa, F12, Q. Tân Bình, Tp. HCM";

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public locationCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, public service: RestaurantService) {
		this.menuCtrl.swipeEnable(true, 'authenticated');
		this.menuCtrl.enable(true);
		this.findAll();
  }

  openRestaurantListPage(proptype) {
  	this.navCtrl.push('page-restaurant-list', proptype);
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

	openRestaurantDetail(restaurant: any) {
  	this.navCtrl.push('page-restaurant-detail', {
			'id': restaurant.id
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
	    this.service.findByName(this.searchKey)
	        .then(data => {
	            this.restaurants = data;
	        })
	        .catch(error => alert(JSON.stringify(error)));
	}

	onCancel(event) {
	    this.findAll();
	}

	findAll() {
	    this.service.findAll()
	        .then(data => this.restaurants = data)
	        .catch(error => alert(error));
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
