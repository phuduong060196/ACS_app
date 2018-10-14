import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { api } from './config';
import { Observable } from 'rxjs/Observable';
import { map, tap, catchError } from 'rxjs/operators';

let restaurantsURL = api.SERVER_URL + 'restaurants/',
    favoritesURL = restaurantsURL + 'favorites/';

let httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RestaurantService {

    constructor(public http: HttpClient) {
    }

    findAll(): Observable<any> {
	    return this.http.get(restaurantsURL).pipe(
	      map(this.extractData),
	      catchError(this.handleError)
	    );
    }

    findByName(key: string): Observable<string> {
      return this.http.get(restaurantsURL + "?key=" + key).pipe(
      	map(this.extractData),
      	catchError(this.handleError)
    	);
    }

    findById(id): Observable<number> {
      return this.http.get(restaurantsURL + id).pipe(
	      map(this.extractData),
	      catchError(this.handleError)
	    );
    }

    getFavorites(): Observable<any[]> {
       return this.http.get(restaurantsURL).pipe(
	      map(this.extractData),
	      catchError(this.handleError)
	    );
    }

    favorite(restaurant) {
      let body = JSON.stringify(restaurant);

      return this.http.post(favoritesURL, body, httpOptions).pipe(
      	tap((res) => console.log('Favorite added!')),
      	catchError(this.handleError)
    );
    }

    unfavorite(favorite) {
	    return this.http.delete(favoritesURL + favorite.id, httpOptions).pipe(
	      tap(_ => console.log(`Favorite deleted id => ${favorite.id}`)),
	      catchError(this.handleError)
	    );
    }

    // Private
	  private extractData(res: Response) {
	    let body = res;
	    return body || {};
	  }

	  private handleError (error: Response | any) {
	    let errMsg: string;
	    if (error instanceof Response) {
	      const err = error || '';
	      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
	    } else {
	      errMsg = error.message ? error.message : error.toString();
	    }
	    console.error(errMsg);
	    return Observable.throw(errMsg);
	  }

}
