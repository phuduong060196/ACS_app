import {Component} from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';

@IonicPage({
	name: 'page-nearby',
	segment: 'nearby'
})

@Component({
    selector: 'page-nearby',
    templateUrl: 'nearby.html'
})
export class NearbyPage {

    restaurants: Array<any>;
	lat: number = 42.35663;
	lng: number = -71.11095;

    constructor(public navCtrl: NavController, public service: RestaurantService, public modalCtrl: ModalController) {
        this.findAll();
    }

    openRestaurantFilterPage() {
      let modal = this.modalCtrl.create('page-restaurant-filter');
      modal.present();
    }

    openRestaurantDetail(restaurant: any) {
  		this.navCtrl.push('page-restaurant-detail', {
				'id': restaurant.id
			});
    }

    findAll() {
        this.service.findAll()
            .then(data => this.restaurants = data)
            .catch(error => alert(error));
    }

    ionViewDidLoad() {
    }

}
