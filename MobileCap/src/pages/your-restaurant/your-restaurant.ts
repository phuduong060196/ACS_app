import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';

@IonicPage({
	name: 'page-your-restaurant',
	segment: 'your-restaurant'
})

@Component({
    selector: 'your-restaurant',
    templateUrl: 'your-restaurant.html'
})
export class YourRestaurantPage implements OnInit {

  public onYourRestaurantForm: FormGroup;

  constructor(private _fb: FormBuilder, public navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {

  }

  ngOnInit() {
    this.onYourRestaurantForm = this._fb.group({
      profiledata: [true, Validators.compose([
        Validators.required
      ])],
      restaurantTitle: ['', Validators.compose([
        Validators.required
      ])],
      restaurantAddress: ['', Validators.compose([
        Validators.required
      ])],
      restaurantType: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  // process send button
  sendData() {
    // send booking info
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    // show message
    let toast = this.toastCtrl.create({
      showCloseButton: true,
      cssClass: 'profiles-bg',
      message: 'Your restaurant was registered!',
      duration: 3000,
      position: 'bottom'
    });

    loader.present();

    setTimeout(() => {
      loader.dismiss();
      toast.present();
      // back to home page
      this.navCtrl.setRoot('page-home');
    }, 3000)
  }

}
