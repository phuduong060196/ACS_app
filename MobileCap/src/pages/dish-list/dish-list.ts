import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {DishService} from '../../providers/dish-service-mock';

@IonicPage({
	name: 'page-dish-list',
	segment: 'dish-list'
})

@Component({
    selector: 'page-dish-list',
    templateUrl: 'dish-list.html'
})
export class DishListPage {

    dishes: Array<any>;

    constructor(public navCtrl: NavController, public dishService: DishService) {
        this.dishes = this.dishService.findAll();
    }

    openDishDetail(dish) {
        this.navCtrl.push('page-dish-detail', {
	      'id': dish.id
	    });
    }

}
