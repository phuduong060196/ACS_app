import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";
import {GetUrlProvider} from "../../providers/get-url/get-url";

/**
 * Generated class for the ChatDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface Post {
	isCustomer: any;
	message: string;
}

export interface Item {
	id: string;
	name: string;
}

@IonicPage({
	name: 'page-chat-detail',
	segment: 'chat-detail',
})
@Component({
	selector: 'page-chat-detail',
	templateUrl: 'chat-detail.html'
})
export class ChatDetailPage {
	paramId: any;
	private chat_path: 'chat';
	private chat_path1: 'chat1';
	postsCol: AngularFirestoreCollection<Post>;
	posts: any;
	// post: Observable<Post>;
	message: string;
	@ViewChild(Content) content: Content;

	constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFirestore, public http: HttpClient, public getUrlPro: GetUrlProvider) {
		this.paramId = this.navParams.get('id');
	}

	sendMessage() {
		if (this.message != undefined && this.message != '') {
			//get UserID
			let customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
			//get SupplierID
			let supplierId = this.paramId.supId;
			let dateTime = new Date();
			this.database.collection('chat').doc(supplierId + '-' + customerId).set({
				'supId': supplierId,
				'cusId': customerId,
				'lastTime': dateTime,
				'isCustomer': true,
				'supName': this.paramId.supName,
				'supAvatar': this.paramId.supAvatar
			});
			this.database.collection('chat').doc(supplierId + '-' + customerId).collection('chat1').add({
				'message': this.message,
				'isCustomer': true,
				'time': dateTime
			});

			this.scrollToBottom();
			this.message = '';
		}

	}

	loadMessage() {
		//get UserID
		let customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		//get SupplierID
		let supplierId = this.paramId.supId;
		//load from firestore

		this.postsCol = this.database.collection('chat').doc(supplierId + '-' + customerId).collection('chat1', ref =>
			ref.orderBy('time', 'asc'));
		this.posts = this.postsCol.valueChanges();
		this.scrollToBottom();
	}

	scrollToBottom() {
		setTimeout(() => {
			this.content.scrollToBottom(300);
		});
	}

	ionViewDidLoad() {
		if (this.paramId == null) {
			this.navCtrl.push('page-supplier-detail');
		}
		this.loadMessage();
	}

}
