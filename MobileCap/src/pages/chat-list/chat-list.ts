import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {GetUrlProvider} from "../../providers/get-url/get-url";
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';
import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';
import {HttpHelperProvider} from "../../providers/http-helper/http-helper";

interface Post {
	supId: number;
}

@IonicPage({
	name: 'page-chat-list',
	segment: 'chat-list'
})
@Component({
	selector: 'page-chat-list',
	templateUrl: 'chat-list.html',
})
export class ChatListPage implements OnInit{
	public supplierId: number;
	public supplier: any;
	posts: any;
	posts1: any;
	postsCol: AngularFirestoreCollection<Post>;
	post: Observable<Post>;
	flagExist: boolean;

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public getUrlPro: GetUrlProvider, public database: AngularFirestore, public loadingPro: LoadingHelperProvider, public httpHelperPro: HttpHelperProvider) {
	}

	loadDocument() {
		this.loadingPro.presentLoading('Đang tải...');
		//get UserID, Name and Avatar
		let customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		this.postsCol = this.database.collection('chat', ref => ref.where('cusId', '==', customerId));
		this.posts = this.postsCol.snapshotChanges()
			.map(actions => {
				return actions.map(a => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					this.flagExist = true;
					this.loadingPro.dismissLoading();
					return {data, id};
				});
			});
		this.posts1 = this.postsCol.valueChanges().subscribe(
			(res) => {
				this.loadingPro.dismissLoading();
			}
		)
	}

	openChatDetail(param) {
		this.navCtrl.push('page-chat-detail', {'id': param});
	}

	ngOnInit() {
		this.loadDocument();
	}

}
