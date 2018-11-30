import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { NotificationHelperProvider } from '../../providers/notification-helper/notification-helper';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import 'rxjs/add/operator/map';
import { AccessTokenHelperProvider } from '../../providers/access-token-helper/access-token-helper';
import {LoadingHelperProvider} from "../../providers/loading-helper/loading-helper";
interface Post {
    SeenByCustomer: any;
}

@IonicPage({
    name: 'page-message-list',
    segment: 'message-list'
})

@Component({
    selector: 'page-message-list',
    templateUrl: 'message-list.html'
})
export class MessageListPage implements OnInit{

    messages: any;

    postsCol: AngularFirestoreCollection<Post>;
    docId: any;

    constructor(private database: AngularFirestore, private notificationHelperPro: NotificationHelperProvider, public navCtrl: NavController, private AccessTokenHelperProvider: AccessTokenHelperProvider, public loadingPro: LoadingHelperProvider) {
        this.notificationHelperPro.GetTestNotification.subscribe((val) => {
            this.messages = val;
        });
    }

    loadDocument(){
		this.AccessTokenHelperProvider.GetAccessToken.subscribe(
			(res) => {
				if (localStorage.getItem('token')){
					this.loadingPro.presentLoading('');
					const cusId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
					this.postsCol = this.database.collection('notification', ref => ref.where('CustomerId', '==', cusId));
					this.docId = this.postsCol.snapshotChanges()
						.map(actions => {
							return actions.map(a => {
								const data = a.payload.doc.data();
								const id = a.payload.doc.id;
								this.loadingPro.dismissLoading();
								return {data, id};
							});
						});
				}
			}
		)
	}

    itemTapped(id) {
    	console.log(id);
		this.AccessTokenHelperProvider.GetAccessToken.subscribe(
			(res) => {
				if (localStorage.getItem('token')) {
					this.loadingPro.presentLoading('');
					const cusId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
					// console.log(cusId);
					this.database.collection('notification', ref => ref.where('CustomerId', '==', cusId)).doc(id.id).update({
						'SeenByCustomer': true
					});
					this.loadingPro.dismissLoading();
				}
			}
		)
		const message = {'OrderId': id.orderId};
        // chuyen trang can chinh
         this.navCtrl.push('page-order-detail', {
             'message': message
         });
    }

    onViewDidLoad(){

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
