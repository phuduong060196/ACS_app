import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
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
	message: string;
	supplier: any;
	supplierAvatar: String;
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
				'supAvatar': this.paramId.supAvatar,
				'seenBySup': false,
				'seenByCus': true,
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

	setSeenMessage() {
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
			'supAvatar': this.paramId.supAvatar,
			'seenBySup': true,
			'seenByCus': true,
		});
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

	loadSupplier() {
		this.http.get(this.getUrlPro.getUrl + '/api/supplier/get-by-id?id=' + this.paramId.supId)
			.subscribe((res: any) => {
				this.supplier = res.data;
				console.log(this.supplier);
			}, (err) => {
				console.log(err);
			});
	}

	openSupplierDetail() {
		this.navCtrl.push('page-supplier-detail',
			{'supplier': this.supplier});
	}

	ionViewDidLoad() {
		if (this.paramId == null) {
			this.navCtrl.push('page-supplier-detail');
		}
		this.setSeenMessage();
		this.loadMessage();
		this.loadSupplier();
	}

}
