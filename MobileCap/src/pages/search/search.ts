import { Component, ViewChild } from '@angular/core';
import {
	IonicPage,
	MenuController,
	ModalController,
	NavController, Platform, ToastController
} from 'ionic-angular';
import { HttpHelperProvider } from "../../providers/http-helper/http-helper";
import { Geolocation } from "@ionic-native/geolocation";
import { HttpClient } from "@angular/common/http";
import { LocalHelperProvider } from "../../providers/local-helper/local-helper";
import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';
import { FilterSupportProvider } from '../../providers/filter-support/filter-support';

@IonicPage({
	name: 'page-search',
	segment: 'search'
})
@Component({
	selector: 'page-search',
	templateUrl: 'search.html',
})
export class SearchPage {
	suppliers: any;
	suppliersNearby: any;
	lat: number;
	lng: number;
	searchKey: string;
	yourLocation: string;
	filterValue: any;
	@ViewChild('searchBar') searchView: any;

	constructor(private filterSupport: FilterSupportProvider, public navCtrl: NavController, public menuCtrl: MenuController, public modalCtrl: ModalController, public toastCtrl: ToastController, public httpHelperPro: HttpHelperProvider,
		private platform: Platform, private geolocation: Geolocation, private http: HttpClient,
		private localPro: LocalHelperProvider, private loadingHelperPro: LoadingHelperProvider) {
		this.localPro.GetLocation.subscribe(val => {
			if (val) {
				this.lat = val.lat;
				this.lng = val.lng;
				this.yourLocation = val.yourLocation;
				this.forcusOnSearchBar();
			} else {
				this.getCurentLocation();
			}
		});
		this.filterSupport.GetFilterSearch.subscribe(
			(val) => {
				this.filterValue = val;
				if (this.suppliersNearby) {
					if (this.filterValue === 'D') {
						this.suppliersNearby.sort(this.compareDistance);
					}
					if (this.filterValue === 'R') {
						this.suppliersNearby.sort(this.compareRating);
					}
					if (this.filterValue === 'P') {
						this.suppliersNearby.sort(this.comparePrice);
					}
				}
			}
		);
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
		this.loadingHelperPro.presentLoading('Đang tải...');
		this.httpHelperPro.get('/api/location/search-location-with-lat-long?latitude=' + this.lat + '&longitude=' + this.lng + '&service=' + this.searchKey).subscribe(
			(res: any) => {
				res.forEach(element => {
					let oldUrl = element.Avatar;
					if (element.Avatar) {
						element.Avatar = 'http://web-capstone.azurewebsites.net' + oldUrl;
					}
				});
				this.suppliersNearby = res;
				this.suppliersNearby.forEach(supplier => {
					supplier.Branches[0].Latitude = parseFloat(supplier.Branches[0].Latitude);
					supplier.Branches[0].Longitude = parseFloat(supplier.Branches[0].Longitude);
					let distance = this.getDistanceFromLatLonInKm(this.lat, this.lng, supplier.Branches[0].Latitude, supplier.Branches[0].Longitude);
					supplier.Distance = distance.toFixed(2);
				});
				console.log(res);
				this.loadingHelperPro.dismissLoading();
			},
			(err) => {
				console.log(err);
				this.loadingHelperPro.dismissLoading();
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
				this.loadingHelperPro.presentLoading('Đang tải vị trí...');
				this.geolocation.getCurrentPosition().then(
					(ressult) => {
						this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + ressult.coords.latitude + ',' + ressult.coords.longitude + '&key=AIzaSyDr5qwgemJp4LtodR8lvXg382V-cDFK3bY&sensor=false').subscribe(
							(res: any) => {
								console.log(res);
								this.localPro.SetLocation = {
									lat: ressult.coords.latitude,
									lng: ressult.coords.longitude,
									yourLocation: res.results[0].formatted_address
								};
								this.loadingHelperPro.dismissLoading();
								this.forcusOnSearchBar();
							}
						);
					}
				);
			}
		);
	}

	openRestaurantFilterPage() {
		let modal = this.modalCtrl.create('page-filter-service');
		modal.present();
	}

	ionViewWillEnter() {
		this.navCtrl.canSwipeBack();
	}

	ionViewDidLoad() {
		this.forcusOnSearchBar();
	}

	forcusOnSearchBar() {
		setTimeout(() => {
			this.searchView.setFocus();
		}, 500);
	}

	compareDistance(a: any, b: any) {
		if (a.Distance < b.Distance) {
			return -1;
		}
		else if (a.Distance > b.Distance) {
			return 1;
		}
		else {
			if (a.Rating < b.Rating) {
				return 1;
			}
			else if (a.Rating > b.Rating) {
				return -1;
			} else {
				if (a.Services[0].Price < b.Services[0].Price) {
					return -1;
				}
				else if (a.Services[0].Price > b.Services[0].Price) {
					return 1;
				}
				else {
					return 0;
				}
			}
		}
	}

	compareRating(a: any, b: any) {
		if (a.Rating < b.Rating) {
			return 1;
		}
		else if (a.Rating > b.Rating) {
			return -1;
		}
		else {
			if (a.Distance < b.Distance) {
				return -1;
			}
			else if (a.Distance > b.Distance) {
				return 1;
			} else {
				if (a.Services[0].Price < b.Services[0].Price) {
					return -1;
				}
				else if (a.Services[0].Price > b.Services[0].Price) {
					return 1;
				}
				else {
					return 0;
				}
			}
		}
	}

	comparePrice(a: any, b: any) {
		if (a.Services[0].Price < b.Services[0].Price) {
			return -1;
		}
		else if (a.Services[0].Price > b.Services[0].Price) {
			return 1;
		}
		else {
			if (a.Distance < b.Distance) {
				return -1;
			}
			else if (a.Distance > b.Distance) {
				return 1;
			} else {
				if (a.Rating < b.Rating) {
					return 1;
				}
				else if (a.Rating > b.Rating) {
					return -1;
				}
				else {
					return 0;
				}
			}
		}
	}

}
