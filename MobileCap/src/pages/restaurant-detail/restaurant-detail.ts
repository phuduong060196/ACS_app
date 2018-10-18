import { Component } from '@angular/core';
import { IonicPage, ActionSheetController, NavController, NavParams, ToastController } from 'ionic-angular';

import { RestaurantService } from '../../providers/restaurant-service-mock';
import { DishService } from '../../providers/dish-service-mock';
import { CartService } from '../../providers/cart-service-mock';
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';

@IonicPage({
    name: 'page-restaurant-detail',
    segment: 'restaurant/:id'
})

@Component({
    selector: 'page-restaurant-detail',
    templateUrl: 'restaurant-detail.html'
})
export class RestaurantDetailPage {

    supplier: any;
    restaurantopts: String = 'menu';

    constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public cartService: CartService, public restaurantService: RestaurantService, public dishService: DishService, public toastCtrl: ToastController, public httpHelperPro: HttpHelperProvider) {
        this.supplier = this.navParams.get('supplier');
        console.log(this.supplier);
    }


}
