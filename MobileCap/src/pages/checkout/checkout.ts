import {Component, OnInit} from "@angular/core";
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {OrdersService} from '../../providers/orders-service-mock';
import {CartService} from '../../providers/cart-service-mock';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

@IonicPage({
	name: 'page-checkout',
	segment: 'checkout'
})

@Component({
	selector: 'page-checkout',
	templateUrl: 'checkout.html'
})
export class CheckoutPage implements OnInit {

	checkoutData: any;
	totalVal: number = 0;
	orderNumber: number = Math.floor(Math.random() * 10000);
	checkoutOnline: boolean;
	public onYourCheckoutForm: FormGroup;

	constructor(public nav: NavController, public navParams: NavParams, private storage: Storage, public ordersService: OrdersService, public cartService: CartService, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private _fb: FormBuilder, private inAppBrowser: InAppBrowser) {
		this.checkoutData = this.navParams.data.orders;

		// if (this.checkoutData) {
		//   	this.checkoutData.forEach((val, i) => {
		//   		this.totalVal = this.totalVal + (val.order.price * val.qtd)
		//   	});
		//
		//   	this.storage.set('order-' + this.orderNumber, this.checkoutData);
		// } else {
		// 	this.nav.setRoot('page-home');
		// }

		// console.log(this.checkoutData);
	}

	getRadioValue(number) {
		if (number == 2) {
			this.checkoutOnline = true;
		}else {
			this.checkoutOnline = false;
		}
	}

	// process send button
	send() {
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		// show message
		let toast = this.toastCtrl.create({
			showCloseButton: true,
			cssClass: 'profile-bg',
			message: 'Thanh toán thành công',
			duration: 3000,
			position: 'bottom'
		});

		loader.present();

		setTimeout(() => {
			loader.dismiss();

			this.ordersService.saveOrder(this.checkoutData, this.totalVal, this.orderNumber).then(data => {
				toast.present();
				this.cartService.cleanCart();
			})
			// back to home page
			this.nav.setRoot('page-home');
		}, 3000)
	}

	isFieldInvalid(field: string, form: FormGroup) {
		return (
			(form.get(field).touched && form.get(field).hasError('required'))
		);
	}

	openNganluong(){
		let url = 'https://www.nganluong.vn/button_payment.php?' +
			'receiver=jinnguyen1200@gmail.com' +
			'&product_name=99' +
			'&price=10000' +
			'&return_url=(URL thanh toán thành công)' +
			'&comments=test ionic';
		const browser = this.inAppBrowser.create(url, '_self')
	}

	ngOnInit(): void {
		this.onYourCheckoutForm = this._fb.group({
			feedbackContent: ['', Validators.compose([
				Validators.required
			])]
		});
	}


}
