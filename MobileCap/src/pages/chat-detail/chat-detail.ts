import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {finalize} from "rxjs/operators";
import 'rxjs/add/operator/map';
import { HttpClient } from "@angular/common/http";
import { GetUrlProvider } from "../../providers/get-url/get-url";
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';

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
	progressSto: Observable<number>;
	flagDoneImage: boolean;


	constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFirestore, public http: HttpClient, public getUrlPro: GetUrlProvider, public storage: AngularFireStorage, private camera: Camera) {
		this.paramId = this.navParams.get('id');
	}

	sendMessage() {
		if (this.message != undefined && this.message != '') {
			this.messageInput.setFocus();
			//get UserID
			const customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
			//get SupplierID
			const supplierId = this.paramId.supId;
			const dateTime = new Date();
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
		const customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		//get SupplierID
		const supplierId = this.paramId.supId;
		this.database.collection(this.chat_path).doc(supplierId + '-' + customerId).update({
			'seenByCus': true,
		});
	}

	loadMessage() {
		//get UserID
		const customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		//get SupplierID
		const supplierId = this.paramId.supId;
		//load from firestore

		this.postsCol = this.database.collection(this.chat_path).doc(supplierId + '-' + customerId).collection(this.chat_path1, ref =>
			ref.orderBy('time', 'asc'));
		this.posts = this.postsCol.valueChanges();
		// if (this.postsCol.snapshotChanges()){
		// 	this.scrollToBottom();
		// }
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
					res.data.Avatar = this.getUrlPro.getUrl + oldUrl;
				}
				this.supplier = res.data;
			}, (err) => {
				console.log(err);
			});
	}

	openSupplierDetail() {
		this.navCtrl.push('page-supplier-detail',
			{ 'supplier': this.supplier });
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
			quality: 70,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			sourceType: this.camera.PictureSourceType.CAMERA,
			mediaType: this.camera.MediaType.PICTURE,
			allowEdit: true
		};
		return await this.camera.getPicture(options);
	}

	async chooseImage() {
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
			mediaType: this.camera.MediaType.PICTURE,
			saveToPhotoAlbum: false
		};
		return await this.camera.getPicture(options);
	}

	createUploadTask(file: string): void {
		//get UserID
		const customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		//get SupplierID
		const supplierId = this.paramId.supId;
		const dateTime = new Date();
		const filePath = `images_${new Date().getTime()}.jpg`;
		const image = 'data:image/jpeg;base64,' + file;
		const fileRef = this.storage.ref(filePath);
		this.task = fileRef.putString(image, 'data_url');
		this.progressSto = this.task.percentageChanges();

		//Hide progress bar
		this.task.snapshotChanges().subscribe(
			(res) => {
				if (res.bytesTransferred == res.totalBytes) {
					this.flagDoneImage = true;
				}
			}
		);

		//Get Download URL
		this.task.snapshotChanges().pipe(
			finalize(() => {
				fileRef.getDownloadURL().subscribe((url) => {
					//Set download url into firestore
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
						'message': url,
						'isCustomer': true,
						'time': dateTime,
						'isImage': true
					});
				});
			}
			)
		).subscribe();
	}

	async uploadCameraHandler() {
		const base64 = await this.captureImage();
		this.createUploadTask(base64);
		this.scrollToBottom();
	}

	async uploadLibraryHandler() {
		const base64 = await this.chooseImage();
		this.createUploadTask(base64);
		this.scrollToBottom();
	}

}
