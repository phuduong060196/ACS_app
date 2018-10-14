import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

import {DishService} from '../../providers/dish-service-mock';
import {CartService} from '../../providers/cart-service-mock';

@IonicPage({
	name: 'page-dish-detail',
	segment: 'dish/:id'
})

@Component({
    selector: 'page-dish-detail',
    templateUrl: 'dish-detail.html'
})
export class DishDetailPage {
	param: number;
  dish: any;
  qtd: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public dishService: DishService, public cartService: CartService) {
    this.param = this.navParams.get('id');
  	this.dish = this.dishService.getItem(this.param) ? this.dishService.getItem(this.param) : this.dishService.findAll()[0];
  }

  // minus adult when click minus button
  minusQtd() {
    this.qtd--;
  }
  // plus adult when click plus button
  plusQtd() {
    this.qtd++;
  }

  addcart(dish, qtd) {
  	this.cartService.addtoCart(dish, qtd).then(dish => {
      let toast = this.toastCtrl.create({
          message: 'Dish added to Cart',
          cssClass: 'mytoast',
          duration: 2000
      });
      toast.present(toast);
  	});
  }

	favorite(dish) {
		this.dishService.favorite(dish)
			.then(dish => {
				let toast = this.toastCtrl.create({
					message: 'Dish favorited!',
					cssClass: 'mytoast',
					duration: 2000
				});
				toast.present(toast);
			});
	}

  openCart() {
    this.navCtrl.push('page-cart');
  }

}
