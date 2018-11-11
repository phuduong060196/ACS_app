import {Component, OnInit} from "@angular/core";
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {OrdersService} from '../../providers/orders-service-mock';
import {CartService} from '../../providers/cart-service-mock';

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
	paymethods: string = 'creditcard';
	totalVal: number = 0;
	orderNumber: number = Math.floor(Math.random() * 10000);
	checkoutOnline: boolean;

	constructor(public nav: NavController, public navParams: NavParams, private storage: Storage, public ordersService: OrdersService, public cartService: CartService, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
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

	ngOnInit(): void {

	}


}
