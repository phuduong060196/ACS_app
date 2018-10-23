import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
	userID: any;
	message: string;
}

@IonicPage({
	name: 'page-chat-detail',
	segment: 'chat-detail',
})
@Component({
  selector: 'page-chat-detail',
  templateUrl: 'chat-detail.html',
})
export class ChatDetailPage implements OnInit{
	param: any;
	postsCol: AngularFirestoreCollection<Post>;
	posts: Observable<Post[]>;
	message: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFirestore) {
  	this.param = this.navParams.get('id');

  }

  sendMessage() {
  	let dateTime = new Date();
  	this.database.collection('/chat').add({'userID': 1, 'message': this.message, 'isCustomer': true, 'time': dateTime});
  	this.message = '';
  }

  ngOnInit() {
	  this.postsCol = this.database.collection('/chat', ref =>
	  ref.orderBy('time', 'asc'));
	  this.posts = this.postsCol.valueChanges();
  }

}
