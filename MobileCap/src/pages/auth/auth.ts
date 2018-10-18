import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController, MenuController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from "@angular/common/http";

import { LoadingHelperProvider } from '../../providers/loading-helper/loading-helper';
import { CustomerServiceProvider } from '../../providers/customer-service/customer-service';
import { AccessTokenHelperProvider } from '../../providers/access-token-helper/access-token-helper';
import { GetUrlProvider } from '../../providers/get-url/get-url';

@IonicPage({
  name: 'page-auth',
  segment: 'auth',
  priority: 'high'
})

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html'
})
export class AuthPage implements OnInit {
  public onLoginForm: FormGroup;
  public onRegisterForm: FormGroup;

  auth: string = "login";
  private token: any = null;

  constructor(private _fb: FormBuilder, public navCtrl: NavController, public alertCtrl: AlertController, public menu: MenuController, public http: HttpClient, public loadingHelperPro: LoadingHelperProvider, public customerServicePro: CustomerServiceProvider, public accessTokenHelperPro: AccessTokenHelperProvider, public getUrlPro: GetUrlProvider) {
    this.menu.swipeEnable(false);
    this.menu.enable(false);
  }

  ngOnInit() {
    this.onLoginForm = this._fb.group({
      username: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });

    this.onRegisterForm = this._fb.group({
      username: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });
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
        handler: data => { }
      }],
    });
    registerAlert.present();
  }

  login() {
    this.loadingHelperPro.presentLoading('Đang đăng nhập...');
    this.customerServicePro.login(this.onLoginForm.value).subscribe(
      (res) => {
        console.log(res);
        this.accessTokenHelperPro.SetAccessToken = res;
        this.loadingHelperPro.dismissLoading();
        this.navCtrl.setRoot('page-home');
      },
      (err) => {
        console.log(err);
        this.loadingHelperPro.dismissLoading();
        this.authMessage('Tên đăng nhập hoặc mật khẩu sai!');
      }
    )
  }

  register() {
    this.loadingHelperPro.presentLoading('Đang gửi yêu cầu...');
    this.http.post(this.getUrlPro.getUrl + '/api/customer/register', this.onRegisterForm.value, { responseType: 'text' }).subscribe(
      (res) => {
        console.log(res);
        this.loadingHelperPro.dismissLoading();
        let resData = JSON.parse(res);
        if (!resData.result) {
          this.authMessage(resData.message);
        } else {
          this.authMessage(resData.message);
          this.navCtrl.setRoot('page-home');
        }
      },
      (err) => {
        console.log(err);
      });
  }
}
