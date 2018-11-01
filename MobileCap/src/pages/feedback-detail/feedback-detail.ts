import {Component, OnInit, ViewChild} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ToastController,
	LoadingController,
	TextInput,
	AlertController
} from 'ionic-angular';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {GetUrlProvider} from '../../providers/get-url/get-url';
import {HttpHelperProvider} from '../../providers/http-helper/http-helper';
import {HttpClient} from "@angular/common/http";
import {LoadingHelperProvider} from "../../providers/loading-helper/loading-helper";


/**
 * Generated class for the FeedbackDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'page-feedback-detail',
	segment: 'feedback-detail'
})
@Component({
	selector: 'page-feedback-detail',
	templateUrl: 'feedback-detail.html',
})
export class FeedbackDetailPage implements OnInit {
	public onYourFeedbackForm: FormGroup;
	starRating: number = 0;
	openCloseAnim: string;
	paramId: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, private _fb: FormBuilder, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public http: HttpClient, public getUrlPro: GetUrlProvider, public loadingHelperPro: LoadingHelperProvider, public alertCtrl: AlertController, public httpHelperPro: HttpHelperProvider) {
		this.paramId = this.navParams.get('id');
	}

	// process send button
	sendData() {
		//get UserID
		let customerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
		//get SupplierID
		let supplierId = this.paramId.supId;
		let form = this.onYourFeedbackForm.value;
		let objectContent = {
			'CustomerId': customerId,
			'SupplierId': supplierId,
			'NumberOfStar': this.starRating,
			'FeedbackContent': form.feedbackContent

		};
		//Send data to web API
		this.httpHelperPro.post('/api/customer/feedback', objectContent).subscribe(
			(res: any) => {
				this.loadingHelperPro.dismissLoading();
				let resData = JSON.parse(res);
				if (!resData.result) {
					this.authMessage(resData.message);
				} else {
					// send feedback info
					let loader = this.loadingCtrl.create({
						content: "Vui lòng đợi..."
					});
					// show message
					let toast = this.toastCtrl.create({
						showCloseButton: true,
						cssClass: 'profiles-bg',
						message: 'Đánh giá thành công!',
						duration: 3000,
						position: 'bottom'
					});

					loader.present();

					setTimeout(() => {
						loader.dismiss();
						toast.present();
						// back to home page
						this.navCtrl.setRoot('page-supplier-list');
					}, 3000)
				}
			}
		);

	}

	isFieldInvalid(field: string, form: FormGroup) {
		return (
			(form.get(field).touched && form.get(field).hasError('required'))
		);
	}

	authMessage(textMess) {
		let registerAlert = this.alertCtrl.create({
			title: 'Thông báo',
			message: textMess,
			buttons: [{
				text: 'Xác nhận',
				handler: data => {
				}
			}],
		});
		registerAlert.present();
	}


	setStar(index: number) {
		this.openCloseAnim = 'open';
		this.starRating = index;
		console.log(index);
	}

	ngOnInit() {
		this.onYourFeedbackForm = this._fb.group({
			feedbackStar: [this.starRating, Validators.compose([
				Validators.required
			])],
			feedbackTitle: ['', Validators.compose([
				Validators.required
			])],
			feedbackContent: ['', Validators.compose([
				Validators.required
			])]
		});

	}

}
