import {Component} from '@angular/core';
import {IonicPage, Config, NavController, NavParams, ToastController, ModalController} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';

@IonicPage({
	name: 'page-restaurant-list',
	segment: 'restaurant-list'
})

@Component({
    selector: 'page-restaurant-list',
    templateUrl: 'restaurant-list.html'
})
export class RestaurantListPage {

    restaurants: Array<any>;
    searchKey: string = "";
    viewMode: string = "list";
	proptype: string;
	label: string = "";
    from: string;
	lat: number = 42.35663;
	lng: number = -71.11095;

    constructor(public navCtrl: NavController, public navParams: NavParams, public service: RestaurantService, public toastCtrl: ToastController, public modalCtrl: ModalController, public config: Config) {
        this.findAll();
        this.proptype = this.navParams.get('proptype') || "";
        this.from = this.navParams.get('from') || "";
        // console.log(this.proptype);
    }

    openFilterModal() {
      let modal = this.modalCtrl.create('page-restaurant-filter');
      modal.present();
    }

    openRestaurantDetail(restaurant: any) {
  		this.navCtrl.push('page-restaurant-detail', {
			'id': restaurant.id
		});
    }

    favorite(restaurant) {
        this.service.favorite(restaurant)
            .then(restaurant => {
                let toast = this.toastCtrl.create({
                    message: 'Property added to your favorites',
                    cssClass: 'mytoast',
                    duration: 2000
                });
                toast.present(toast);
            });
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

}
