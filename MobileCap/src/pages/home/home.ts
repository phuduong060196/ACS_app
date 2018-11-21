import {Component} from '@angular/core';
import {
	IonicPage,
	NavController,
	AlertController,
	MenuController,
	ToastController,
	PopoverController,
	ModalController,
	Platform
} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {HttpClient} from '@angular/common/http';

import {RestaurantService} from '../../providers/restaurant-service-mock';
import {HttpHelperProvider} from '../../providers/http-helper/http-helper';
import {SupplierServiceProvider} from '../../providers/supplier-service/supplier-service';
import {LocalHelperProvider} from '../../providers/local-helper/local-helper';
import {NotificationHelperProvider} from '../../providers/notification-helper/notification-helper';
import {NumberNotificationHelperProvider} from '../../providers/number-notification-helper/number-notification-helper';

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


	notifications: any;
	numberNotification: any;

	constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController,
				public locationCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController,
				public service: RestaurantService, public httpHelperPro: HttpHelperProvider, public supplierServicePro: SupplierServiceProvider,
				private platform: Platform, private geolocation: Geolocation, private http: HttpClient,
				private localPro: LocalHelperProvider, private notificationHelperPro: NotificationHelperProvider, public numberNotificationHelperPro: NumberNotificationHelperProvider) {
		this.localPro.GetLocation.subscribe(val => {
			if (val) {
				this.lat = val.lat;
				this.lng = val.lng;
				this.yourLocation = val.yourLocation;
			} else {
				this.getCurentLocation();
			}
		})
		this.notificationHelperPro.GetTestNotification.subscribe((val) => {
			this.notifications = val;
		})
		this.numberNotificationHelperPro.GetTestNotification.subscribe((val) => {
			this.numberNotification = val;
		});
		this.menuCtrl.swipeEnable(true, 'authenticated');
		this.menuCtrl.enable(true);
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

	openSupplierDetail(supplier: any) {
		this.navCtrl.push('page-supplier-detail', {
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

	openCheckout() {
		this.navCtrl.push('page-checkout');
	}

	openSearchPage(){
		this.navCtrl.push('page-search');
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

	presentNotifications(myEvent) {
		let numberNotification = {
			'Number': 0,
			'Tapped': true
		};
		this.numberNotificationHelperPro.SetTestNotification = numberNotification;
		// console.log(myEvent);
		let popover = this.popoverCtrl.create('page-notifications');
		popover.present({
			ev: myEvent
		});
	}

	ionViewWillEnter() {
		this.navCtrl.canSwipeBack();
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
				this.geolocation.getCurrentPosition().then(
					(ressult) => {
						this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + ressult.coords.latitude + ',' + ressult.coords.longitude + '&key=AIzaSyDr5qwgemJp4LtodR8lvXg382V-cDFK3bY&sensor=false').subscribe(
							(res: any) => {
								this.localPro.SetLocation = {
									lat: ressult.coords.latitude,
									lng: ressult.coords.longitude,
									yourLocation: res.results[1].formatted_address
								};
							}
						);
					}
				);
			}
		);
	}
}
