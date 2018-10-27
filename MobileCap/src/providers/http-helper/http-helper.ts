import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AccessTokenHelperProvider } from '../access-token-helper/access-token-helper';
import { GetUrlProvider } from '../get-url/get-url';

@Injectable()
export class HttpHelperProvider {

  private token: any;

  constructor(public http: HttpClient, public accessTokenHelperPro: AccessTokenHelperProvider, public getUrlPro: GetUrlProvider) {
    accessTokenHelperPro.GetAccessToken.subscribe(token => this.token = token);
  }

  createHeader() {
    return this.token ? new HttpHeaders().set('authorization', 'Bearer ' + this.token.access_token) : new HttpHeaders();
  }

  get(url) {
    let headers = this.createHeader();
    return this.http.get(this.getUrlPro.getUrl + url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = this.createHeader();
    return this.http.post(this.getUrlPro.getUrl + url, data, {
      headers: headers,
      responseType: 'text'
    });
  }

  put(url, data) {
    let headers = this.createHeader();
    return this.http.put(this.getUrlPro.getUrl + url, data, {
      headers: headers,
    });
  }

  // put(url, data, responseType) {
  //   let headers = this.createHeader();
  //   return this.http.put(this.getUrlPro.getUrl + url, data, {
  //     headers: headers,
  //     responseType: responseType
  //   });
  // }

}
