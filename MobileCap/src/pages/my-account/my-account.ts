import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, LoadingController, ToastController, AlertController} from 'ionic-angular';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {LoadingHelperProvider} from '../../providers/loading-helper/loading-helper';
import {HttpHelperProvider} from '../../providers/http-helper/http-helper';
import {AccessTokenHelperProvider} from '../../providers/access-token-helper/access-token-helper';
import {User} from '../../modal/user';
import {ValidationService} from '../../providers/validation.service';

@IonicPage({
	name: 'page-my-account',
	segment: 'my-account'
})

@Component({
	selector: 'page-my-account',
	templateUrl: 'my-account.html'
})
export class MyAccountPage implements OnInit {

	onUpdateForm: FormGroup;
	userInfor: any;
	userName: any;

	constructor(private accessToken: AccessTokenHelperProvider, public navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private fb: FormBuilder, private loadingHelperPro: LoadingHelperProvider, private httpHelperPro: HttpHelperProvider, private alertCtrl: AlertController) {

	}

	ngOnInit() {
		this.loadingHelperPro.presentLoading('');
		this.accessToken.GetAccessToken.subscribe(
			(res: any) => {
				if (JSON.parse(localStorage.getItem('token'))) {
					this.userName = JSON.parse(localStorage.getItem('token')).username;
				}
			}
		);

		if (!this.onUpdateForm) {
			this.httpHelperPro.get('/api/customer/get-info?customerId=' + JSON.parse(localStorage.getItem('token')).CustomerId).subscribe(
				(res: User) => {
					this.userInfor = res;
					this.onUpdateForm = this.fb.group({
						'CustomerId': [0],
						'DateOfBirth': [''],
						'FullName': [this.userInfor.FullName, Validators.required],
						'PhoneNumber': [this.userInfor.PhoneNumber, [Validators.required, ValidationService.phoneNumberValidator]],
						'Email': [this.userInfor.Email, [Validators.required, ValidationService.emailFormatValidator]],
						'Address': [this.userInfor.Address, Validators.required]
					});
					this.loadingHelperPro.dismissLoading();
				},
				(err) => {
					console.log(err);
					this.loadingHelperPro.dismissLoading();
				}
			);
		};
	}

	isFieldInvalid(field: string, form: FormGroup) {
		return (
			(form.get(field).touched && form.get(field).hasError('required'))
		);
	}

	sendData() {
		this.loadingHelperPro.presentLoading('Đang cập nhập...');
		this.userInfor.FullName = this.onUpdateForm.value.FullName;
		this.userInfor.PhoneNumber = this.onUpdateForm.value.PhoneNumber;
		this.userInfor.Email = this.onUpdateForm.value.Email;
		this.userInfor.Address = this.onUpdateForm.value.Address;
		this.httpHelperPro.put('/api/customer/info', this.userInfor).subscribe(
			(res: any) => {
				this.loadingHelperPro.dismissLoading();
				console.log(res);
				this.presentAlert(res.message);
			},
			(err) => {
				console.log(err);
			}
		);
		// this.navCtrl.setRoot('page-home');
	}

	presentAlert(subTitle) {
		let alert = this.alertCtrl.create({
			title: 'Thông báo',
			subTitle: subTitle,
			buttons: ['Xác nhận']
		});
		alert.present();
	}

}
