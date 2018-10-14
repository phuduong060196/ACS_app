import {Injectable} from '@angular/core';
import categories from './mock-categories';

@Injectable()
export class CategoryService {

    findAll() {
        return Promise.resolve(categories);
    }

    findById(id) {
        return Promise.resolve(categories[id - 1]);
    }

}
