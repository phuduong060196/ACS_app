import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';

@IonicPage({
	name: 'page-favorite-list',
	segment: 'favorites'
})

@Component({
    selector: 'page-favorite-list',
    templateUrl: 'favorite-list.html'
})

export class FavoriteListPage {

    favorites: Array<any> = [];

    constructor(public navCtrl: NavController, public service: RestaurantService) {
        this.getFavorites();
        // console.log(this.favorites);
    }

    itemTapped(favorite) {
		this.navCtrl.push('page-restaurant-detail', {
			'id': favorite.restaurant.id
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
