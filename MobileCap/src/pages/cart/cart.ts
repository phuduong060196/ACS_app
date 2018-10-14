import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CartService } from '../../providers/cart-service-mock';

@IonicPage({
	name: 'page-cart',
	segment: 'cart'
})

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})

export class CartPage {

	orders: Array<any> = [];
	totalVal: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cartService: CartService) {
    this.getOrders();
  }

  removeOrder (order) {
    this.cartService.removefromCart(order)
        .then(() => {
            this.getOrders();
        })
        .catch(error => alert(JSON.stringify(error)));
  }

  getOrders () {
    this.cartService.getOrders().then(orders => {
    	this.orders = orders
    	this.totalVal = 0;
    	this.orders.forEach((val, i) => {
    		this.totalVal = this.totalVal + (val.order.price * val.qtd)
    	});
    });
  }

  // minus adult when click minus button
  minusQtd(order) {
		this.cartService.editQtdOrder(order, 'minus')
      .then(() => {
          this.getOrders();
      })
      .catch(error => alert(JSON.stringify(error)));
  }

  // plus adult when click plus button
  plusQtd(order) {
		this.cartService.editQtdOrder(order, 'plus')
      .then(() => {
          this.getOrders();
      })
      .catch(error => alert(JSON.stringify(error)));
  }

  openCheckout() {
      this.navCtrl.push('page-checkout', {orders: this.orders});
  }

}
