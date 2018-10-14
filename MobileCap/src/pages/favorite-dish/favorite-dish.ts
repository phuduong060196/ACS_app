import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {DishService} from '../../providers/dish-service-mock';

@IonicPage({
	name: 'page-favorite-dish',
	segment: 'favoritedish'
})

@Component({
    selector: 'page-favorite-dish',
    templateUrl: 'favorite-dish.html'
})

export class FavoriteDishPage {

    favorites: Array<any> = [];

	constructor(public navCtrl: NavController, public service: DishService) {
        this.getFavorites();

    }

    itemTapped(favorite) {
		this.navCtrl.push('page-dish-detail', {
			'id': favorite.dish.id
		});
    }

    deleteItem(favorite) {
        this.service.unfavorite(favorite)
            .then(() => {
                this.getFavorites();
            })
            .catch(error => alert(JSON.stringify(error)));
    }

    getFavorites() {
        this.service.getFavorites()
            .then(data => this.favorites = data);
    }

}
