import {Component} from '@angular/core';
import {IonicPage, Config, NavController, NavParams, ToastController, ModalController} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';
import {HttpClient} from "@angular/common/http";
import {GetUrlProvider} from "../../providers/get-url/get-url";

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
	public  suppliers:any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public service: RestaurantService, public toastCtrl: ToastController, public modalCtrl: ModalController, public config: Config, public http: HttpClient, public getUrlPro: GetUrlProvider) {
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

	public loadAllSupplies(){
		this.http.get(this.getUrlPro.getUrl + '/api/supplier/get-all?name=')
			.subscribe((res:any) => {

				this.suppliers = res.data;
				// console.log(this.suppliers);

			}, (err) => {
				console.log(err);
			});
	}


}
