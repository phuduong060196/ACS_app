import { Component, OnInit } from '@angular/core';
import { IonicPage, ActionSheetController, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';

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
export class RestaurantDetailPage implements OnInit {

    supplier: any;
    services: any;
    feedbacks: any;
    restaurantopts: String = 'menu';

    constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public cartService: CartService, public restaurantService: RestaurantService, public dishService: DishService, public toastCtrl: ToastController, public httpHelperPro: HttpHelperProvider, public modalCtrl: ModalController) {

    }

    ngOnInit() {
        this.supplier = this.navParams.get('supplier');
        if (!this.supplier) {
            this.navCtrl.push('page-home');
            return;
        }
        if (this.supplier) {
            this.getServices(this.supplier.SupplierId);
            this.getFeedback(this.supplier.SupplierId);
        }
    }

    getServices(SupplierId) {
        this.httpHelperPro.get('/api/supplier/search-all-service-by-supplierId?supplierId=' + SupplierId).subscribe(
            (res: any) => {
                console.log(res.data);
                this.services = res.data;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getFeedback(SupplierId) {
        this.httpHelperPro.get('/api/supplier/feedback?supplierId=' + SupplierId).subscribe(
            (res: any) => {
                this.feedbacks = res.feedbacks;
                console.log(this.feedbacks);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    openBookingServiceDetail() {
        let modal = this.modalCtrl.create('page-booking-service-detail', {
            'supplier': this.supplier
        });
        modal.present();
    }

}
