import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

/**
 * Generated class for the BookingServiceDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface Post {
	isCustomer: any;
	message: string;
}

@IonicPage({
	name: 'page-booking-service-detail',
	segment: 'booking-service-detail',
})
@Component({
	selector: 'page-booking-service-detail',
	templateUrl: 'booking-service-detail.html',
})
export class BookingServiceDetailPage implements OnInit {
	paramId: any;
	postsCol: AngularFirestoreCollection<Post>;
	posts: any;
	private booking_path = 'booking';
	private booking_path1 = 'booking1';

	constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFirestore) {
		this.paramId = this.navParams.get('id');
	}

	sendBookingRequest() {
		//get UserID
		let customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		//get SupplierID
		let supplierId = this.paramId.supId;

		let dateTime = new Date();
		console.log('test');
		this.database.collection(this.booking_path).add({
			'supplierId': supplierId,
			'customerId': customerId,
			'time': dateTime
		});
		// this.database.collection(this.booking_path).doc(supplierId + '-' + customerId).set({});
		// this.database.collection(this.booking_path).doc(supplierId + '-' + customerId).collection(this.booking_path1).add({
		// 	'serviceId': '1,3,4',
		// 	'isAccept': false,
		// 	'time': dateTime
		// });


	}

	ngOnInit() {
		if (this.paramId == null) {
			this.navCtrl.push('page-supplier-list');
		}
	}
}
