import { Injectable } from '@angular/core';
import { api } from './config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';

let dishesURL = api.SERVER_URL + 'dishes/';

@Injectable()
export class DishService {

  constructor(public http: HttpClient) {

  }

  // Server URL Api sample
  /////////////////////
  findAll() {
    return this.http.get(dishesURL).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  findById(id) {
    return this.http.get(dishesURL + id).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // Countries API
  getCountries(): Observable<string[]> {
    return this.http.get(api.countriesApi).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

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
