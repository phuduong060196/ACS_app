import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { NotificationHelperProvider } from '../../providers/notification-helper/notification-helper';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import 'rxjs/add/operator/map';

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
export class MessageListPage {

    messages: any;

    postsCol: AngularFirestoreCollection<Post>;
    docId: any;

    constructor(private database: AngularFirestore, private notificationHelperPro: NotificationHelperProvider, public navCtrl: NavController) {
        this.notificationHelperPro.GetTestNotification.subscribe((val) => {
            this.messages = val;
        });
    }

    itemTapped(message) {
        console.log(message.OrderId);
        this.postsCol = this.database.collection('notification', ref => ref.where('OrderId', '==', message.OrderId));
        this.docId = this.postsCol.snapshotChanges().map(
            (val) => {
                return val.map(
                    (ha) => {
                        const id = ha.payload.doc.id;
                        console.log(id);
                        return id;
                    }
                );
            }
        );
        // if (this.docId) {
        //     this.database.doc('notification/' + this.docId).update({
        //         'SeenByCustomer': true,
        //     });
        // }

        // chuyen trang can chinh
        this.navCtrl.push('page-order-detail', {
            'message': message
        });
    }

    deleteItem(message) {
        this.notificationHelperPro.GetTestNotification.subscribe((val) => {
            let notifications = val;
            notifications.splice(notifications.indexOf(message), 1);
            this.notificationHelperPro.SetTestNotification(notifications);
        });
    }

}
