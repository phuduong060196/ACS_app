import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {GetUrlProvider} from "../../providers/get-url/get-url";

/**
 * Generated class for the SupplierListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'page-supplier-list',
	segment: 'supplier-list',
})
@Component({
	selector: 'page-supplier-list',
	templateUrl: 'supplier-list.html',
})
export class SupplierListPage implements OnInit {
	public supplier: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public getUrlPro: GetUrlProvider) {
	}

	public loadAllSuppliers() {
		this.http.get(this.getUrlPro.getUrl + '/api/supplier/get-all?name=')
			.subscribe((res: any) => {

				this.supplier = res.data;

			}, (err) => {
				console.log(err);
			});
	}

	openSupplierDetail(supplier) {
		this.navCtrl.push('page-supplier-detail',
			{'id': supplier});
	}

	ngOnInit(): void {
		this.loadAllSuppliers();
	}

}

