import {Component, OnInit, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

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

interface PostID extends Post{
	id: string;
	name: string;
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
export class ChatDetailPage implements OnInit{
	paramId: any;
	postsCol: AngularFirestoreCollection<Post>;
	posts: any;
	post: Observable<Post>;
	message: string;
	@ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFirestore) {
  	this.paramId = this.navParams.get('id');
  }

  sendMessage() {
  	if (this.message != undefined && this.message != '') {
		//get UserID
		var customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		//get SupplierID
		var supplierId = this.paramId.supId;
		let dateTime = new Date();
		this.database.collection('chat').doc(supplierId+'-'+customerId).collection('chat1').add({'message': this.message, 'isCustomer': true, 'time': dateTime});
		this.message = '';
	}

  }

  loadMessage(){
	  //get UserID
	  let customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
	  //get SupplierID
	  let supplierId = this.paramId.supId;
	  //load from firestore
	  this.postsCol = this.database.collection('chat').doc(supplierId+'-'+customerId).collection('chat1',ref =>
		  ref.orderBy('time', 'asc'));
	  this.posts = this.postsCol.valueChanges();
  }

  ngOnInit() {
  	if (this.paramId == null) {
		this.navCtrl.push('page-supplier-list');
	}
	this.loadMessage();
  }

}
