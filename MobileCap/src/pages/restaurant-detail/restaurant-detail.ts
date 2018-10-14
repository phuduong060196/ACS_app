import {Component} from '@angular/core';
import {IonicPage, ActionSheetController, ActionSheet, NavController, NavParams, ToastController} from 'ionic-angular';

import {RestaurantService} from '../../providers/restaurant-service-mock';
import {DishService} from '../../providers/dish-service-mock';
import {CartService} from '../../providers/cart-service-mock';

@IonicPage({
	name: 'page-restaurant-detail',
	segment: 'restaurant/:id'
})

@Component({
    selector: 'page-restaurant-detail',
    templateUrl: 'restaurant-detail.html'
})
export class RestaurantDetailPage {
	param: number;

    restaurant: any;
    restaurantopts: String = 'menu';
    dishes: Array<any>;

    constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public cartService: CartService, public restaurantService: RestaurantService, public dishService: DishService, public toastCtrl: ToastController) {
		this.param = this.navParams.get('id');
		this.restaurant = this.restaurantService.getItem(this.param) ? this.restaurantService.getItem(this.param) : this.restaurantService.getRestaurants()[0];
    	this.dishes = this.dishService.findAll()
    }

    openDishDetail(dish) {
      this.navCtrl.push('page-dish-detail', {
				'id': dish.id
			});
    }

    favorite(restaurant) {
        this.restaurantService.favorite(restaurant)
            .then(restaurant => {
                let toast = this.toastCtrl.create({
                    message: 'Restaurant added to your favorites',
                    cssClass: 'mytoast',
                    duration: 2000
                });
                toast.present(toast);
            });
    }

    share(restaurant) {
        let actionSheet: ActionSheet = this.actionSheetCtrl.create({
            title: 'Share via',
            buttons: [
                {
                    text: 'Twitter',
                    handler: () => console.log('share via twitter')
                },
                {
                    text: 'Facebook',
                    handler: () => console.log('share via facebook')
                },
                {
                    text: 'Email',
                    handler: () => console.log('share via email')
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => console.log('cancel share')
                }
            ]
        });

        actionSheet.present();
    }

	openCart() {
		this.navCtrl.push('page-cart');
	}

}
