import { Component } from '@angular/core';
import {
	AlertController,
	IonicPage,
	MenuController,
	ModalController,
	NavController, Platform,
	PopoverController, ToastController
} from 'ionic-angular';
import { RestaurantService } from "../../providers/restaurant-service-mock";
import { HttpHelperProvider } from "../../providers/http-helper/http-helper";
import { SupplierServiceProvider } from "../../providers/supplier-service/supplier-service";
import { Geolocation } from "@ionic-native/geolocation";
import { HttpClient } from "@angular/common/http";
import { LocalHelperProvider } from "../../providers/local-helper/local-helper";
import { NotificationHelperProvider } from "../../providers/notification-helper/notification-helper";
import { NumberNotificationHelperProvider } from "../../providers/number-notification-helper/number-notification-helper";
import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';
@IonicPage({
	name: 'page-search',
	segment: 'search'
})
@Component({
	selector: 'page-search',
	templateUrl: 'search.html',
})
export class SearchPage {
	restaurants: Array<any>;
	suppliers: any;
	suppliersNearby: any;
	lat: number;
	lng: number;
	searchKey: string;
	yourLocation: string;

	constructor(public navCtrl: NavController, public menuCtrl: MenuController, public modalCtrl: ModalController, public toastCtrl: ToastController,
		public service: RestaurantService, public httpHelperPro: HttpHelperProvider,
		private platform: Platform, private geolocation: Geolocation, private http: HttpClient,
		private localPro: LocalHelperProvider, private loadingHelperPro: LoadingHelperProvider) {
		this.localPro.GetLocation.subscribe(val => {
			if (val) {
				this.lat = val.lat;
				this.lng = val.lng;
				this.yourLocation = val.yourLocation;
			} else {
				this.getCurentLocation();
			}
		});
		this.menuCtrl.swipeEnable(true, 'authenticated');
		this.menuCtrl.enable(true);
	}

	openSupplierDetail(supplier: any) {
		console.log(supplier);
		this.navCtrl.push('page-supplier-detail', {
			'supplier': supplier
		});
	}

	getAllSuppliers() {
		this.loadingHelperPro.presentLoading('Đang tải...');
		this.httpHelperPro.get('/api/supplier/search?name=&searchBy=price&sort=desc').subscribe(
			(res: any) => {
				this.suppliers = res.data;
				this.loadingHelperPro.dismissLoading();
			},
			(err) => {
				console.log(err);
			}
		);
	}

	search(event) {
		this.httpHelperPro.get('/api/location/search-location-with-lat-long?latitude=' + this.lat + '&longitude=' + this.lng + '&service=' + this.searchKey).subscribe(
			(res: any) => {
				this.suppliersNearby = res;
				this.suppliersNearby.forEach(supplier => {
					supplier.Branches[0].Latitude = parseFloat(supplier.Branches[0].Latitude);
					supplier.Branches[0].Longitude = parseFloat(supplier.Branches[0].Longitude);
					let distance = this.getDistanceFromLatLonInKm(this.lat, this.lng, supplier.Branches[0].Latitude, supplier.Branches[0].Longitude);
					supplier.distance = distance.toFixed(2);
				});
			},
			(err) => {
				console.log(err);
			}
		);
	}

	changeLocation() {
		let modal = this.modalCtrl.create('page-change-location');
		modal.present();
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

	getCurentLocation() {
		this.platform.ready().then(
			() => {
				this.loadingHelperPro.presentLoading('');
				this.geolocation.getCurrentPosition().then(
					(ressult) => {
						this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + ressult.coords.latitude + ',' + ressult.coords.longitude + '&key=AIzaSyDr5qwgemJp4LtodR8lvXg382V-cDFK3bY&sensor=false').subscribe(
							(res: any) => {
								this.localPro.SetLocation = {
									lat: ressult.coords.latitude,
									lng: ressult.coords.longitude,
									yourLocation: res.results[1].formatted_address
								};
								this.loadingHelperPro.dismissLoading();
							}
						);
					}
				);
			}
		);
	}

	openRestaurantFilterPage() {
		let modal = this.modalCtrl.create('page-restaurant-filter');
		modal.present();
	}

	ionViewWillEnter() {
		this.navCtrl.canSwipeBack();
	}

	ionViewDidLoad() {
	}

}
