import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";
import {GetUrlProvider} from "../../providers/get-url/get-url";
import {AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';
import {Camera, CameraOptions} from '@ionic-native/camera';

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
	private chat_path = 'chat';
	private chat_path1 = 'chat1';
	postsCol: AngularFirestoreCollection<Post>;
	posts: any;
	posts1: any;
	message: string;
	supplier: any;
	@ViewChild(Content) content: Content;
	@ViewChild('messageInput') messageInput: any;

	task: AngularFireUploadTask;
	progressSto: any;  // Observable 0 to 100
	imageSto: string; // base64

	constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFirestore, public http: HttpClient, public getUrlPro: GetUrlProvider, public storage: AngularFireStorage, private camera: Camera) {
		this.paramId = this.navParams.get('id');
	}

	sendMessage() {
		if (this.message != undefined && this.message != '') {
			this.messageInput.setFocus();
			//get UserID
			let customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
			//get SupplierID
			let supplierId = this.paramId.supId;
			let dateTime = new Date();
			this.database.collection(this.chat_path).doc(supplierId + '-' + customerId).set({
				'supId': supplierId,
				'cusId': customerId,
				'lastTime': dateTime,
				'isCustomer': true,
				'supName': this.paramId.supName,
				'supAvatar': this.paramId.supAvatar,
				'seenBySup': false,
				'seenByCus': true,
			});
			this.database.collection(this.chat_path).doc(supplierId + '-' + customerId).collection(this.chat_path1).add({
				'message': this.message,
				'isCustomer': true,
				'time': dateTime
			});
			this.message = '';
			this.scrollToBottom();
		}

	}

	setSeenMessage() {
		//get UserID
		let customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		//get SupplierID
		let supplierId = this.paramId.supId;
		this.database.collection(this.chat_path).doc(supplierId + '-' + customerId).update({
			'seenByCus': true,
		});
	}

	loadMessage() {
		//get UserID
		let customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		//get SupplierID
		let supplierId = this.paramId.supId;
		//load from firestore

		this.postsCol = this.database.collection(this.chat_path).doc(supplierId + '-' + customerId).collection(this.chat_path1, ref =>
			ref.orderBy('time', 'asc'));
		this.posts = this.postsCol.valueChanges();
		this.posts1 = this.postsCol.valueChanges().subscribe(
			(res) => {
				this.scrollToBottom();
			}
		);
	}

	scrollToBottom() {
		setTimeout(() => {
			this.content.scrollToBottom(300);
		});
	}

	loadSupplier() {
		this.http.get(this.getUrlPro.getUrl + '/api/supplier/get-by-id?id=' + this.paramId.supId)
			.subscribe((res: any) => {
				let oldUrl = res.data.Avatar;
				if (res.data.Avatar) {
					res.data.Avatar = 'http://web-capstone.azurewebsites.net' + oldUrl;
				}
				this.supplier = res.data;
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

	async captureImage() {
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			sourceType: this.camera.PictureSourceType.CAMERA
		}

		return await this.camera.getPicture(options)
	}

	createUploadTask(file: string): void {

		const filePath = `images_${ new Date().getTime() }.jpg`;

		this.imageSto = 'data:image/jpg;base64,' + file;
		this.task = this.storage.ref(filePath).putString(this.imageSto, 'data_url');

		this.progressSto = this.task.percentageChanges();
	}

	async uploadHandler() {
		const base64 = await this.captureImage();
		this.createUploadTask(base64);
	}

}
