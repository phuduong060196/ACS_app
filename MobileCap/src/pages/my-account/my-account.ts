import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';

@IonicPage({
  name: 'page-my-account',
  segment: 'my-account'
})

@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html'
})
export class MyAccountPage implements OnInit {

  public onUpdateForm: FormGroup;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private fb: FormBuilder, private loadingHelperPro: LoadingHelperProvider, private httpHelperPro: HttpHelperProvider, private alertCtrl: AlertController) {

  }

  ngOnInit() {
    // this.loadingHelperPro.presentLoading(null);
    this.httpHelperPro.get('/api/customer/get-info?customerId=' + JSON.parse(localStorage.getItem('token')).CustomerId).subscribe(
      (res: any) => {
        console.log(res);
        if (res.result) {
          // this.onUpdateForm = this.fb.group({
          //   customerId: [],
          //   fullName: [res.data.FullName, Validators.compose([
          //     Validators.required
          //   ])],
          //   phoneNumber: [res.data.PhoneNumber, Validators.compose([
          //     Validators.required
          //   ])],
          //   email: [res.data.Email, Validators.compose([
          //     Validators.required
          //   ])],
          //   address: [res.data.Address, Validators.compose([
          //     Validators.required
          //   ])]
          // });
        }
      }
    );
    this.onUpdateForm = this.fb.group({
      customerId: [JSON.parse(localStorage.getItem('token')).CustomerId],
      fullName: ['', Validators.compose([
        Validators.required
      ])],
      phoneNumber: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required
      ])],
      address: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  isFieldInvalid(field: string, form: FormGroup) {
    return (
      (form.get(field).touched && form.get(field).hasError('required'))
    );
  }

  sendData() {
    this.loadingHelperPro.presentLoading('Đang cập nhập...');
    this.httpHelperPro.put('/api/customer/info', this.onUpdateForm.value).subscribe(
      (res: any) => {
        this.loadingHelperPro.dismissLoading();
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
