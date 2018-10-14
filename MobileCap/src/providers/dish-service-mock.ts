import {Injectable} from '@angular/core';
import dishes from './mock-dishes';

@Injectable()
export class DishService {

	favoriteCounter: number = 0;
	favorites: Array<any> = [];
	dishes: Array<any> = dishes;

  findAll() {
      return this.dishes;
  }

  findById(id) {
      return Promise.resolve(this.dishes[id - 1]);
  }

  getItem(id) {
    for (var i = 0; i < this.dishes.length; i++) {
      if (this.dishes[i].id === parseInt(id)) {
        return this.dishes[i];
      }
    }
    return null;
	}

	getFavorites() {
		return Promise.resolve(this.favorites);
	}

	favorite(dish) {
		this.favoriteCounter = this.favoriteCounter + 1;
		this.favorites.push({ id: this.favoriteCounter, dish: dish });
		return Promise.resolve();
	}

	unfavorite(favorite) {
		let index = this.favorites.indexOf(favorite);
		if (index > -1) {
			this.favorites.splice(index, 1);
		}
		return Promise.resolve();
	}

}
