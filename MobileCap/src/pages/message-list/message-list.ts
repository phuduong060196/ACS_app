import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';

import {NotificationHelperProvider} from '../../providers/notification-helper/notification-helper';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import 'rxjs/add/operator/map';
import {AccessTokenHelperProvider} from '../../providers/access-token-helper/access-token-helper';
import {LoadingHelperProvider} from "../../providers/loading-helper/loading-helper";

interface Post {
	SeenByCustomer: any;
	CurrentStatus: any;
}

@IonicPage({
	name: 'page-message-list',
	segment: 'message-list'
})

@Component({
	selector: 'page-message-list',
	templateUrl: 'message-list.html'
})
export class MessageListPage implements OnInit {

	messages: any;

	postsCol: AngularFirestoreCollection<Post>;
	docId: any;

	constructor(private database: AngularFirestore, private notificationHelperPro: NotificationHelperProvider, public navCtrl: NavController, private AccessTokenHelperProvider: AccessTokenHelperProvider, public loadingPro: LoadingHelperProvider, public alertCtrl: AlertController ) {
		this.notificationHelperPro.GetTestNotification.subscribe((val) => {
			this.messages = val;
		});
	}

	loadDocument() {
		this.AccessTokenHelperProvider.GetAccessToken.subscribe(
			(res) => {
				if (localStorage.getItem('token')) {
					this.loadingPro.presentLoading('');
					const cusId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
					this.postsCol = this.database.collection('booking', ref => ref.where('CustomerId', '==', cusId).orderBy('CurrentStatus.UpdatedDate', 'desc'));
					this.docId = this.postsCol.snapshotChanges()
						.map(actions => {
							return actions.map(a => {
								const data = a.payload.doc.data();
								const id = a.payload.doc.id;
								// const date = new Date(data.CurrentStatus.UpdatedDate).getDate();
								// console.log(date);
								this.loadingPro.dismissLoading();
								return {data, id};
							});
						});
				}
			}
		)
	}

	itemTapped(id) {
		this.AccessTokenHelperProvider.GetAccessToken.subscribe(
			(res) => {
				if (localStorage.getItem('token')) {
					this.loadingPro.presentLoading('');
					const cusId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
					// console.log(cusId);
					this.database.collection('booking', ref => ref.where('CustomerId', '==', cusId)).doc(id.id).update({
						'SeenByCustomer': true
					});
					this.loadingPro.dismissLoading();
				}
			}
		)
		if (id.orderId) {
			const message = {'OrderId': id.orderId};
			// chuyen trang can chinh
			this.navCtrl.push('page-order-detail', {
				'message': message
			});
		}
		if(!id.orderId){
			let alert = this.alertCtrl.create({
				title: 'Yêu cầu bị huỷ',
				message: 'Lý do: ' + id.supplierNote,
				buttons: ['OK']
			});
			alert.present();
		}

	}

	onViewDidLoad() {

	}

	deleteItem(message) {
		this.notificationHelperPro.GetTestNotification.subscribe((val) => {
			let notifications = val;
			notifications.splice(notifications.indexOf(message), 1);
			this.notificationHelperPro.SetTestNotification(notifications);
		});
	}

	ngOnInit(): void {
		this.loadDocument();
	}

}
