import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AccessTokenHelperProvider } from '../access-token-helper/access-token-helper';
import { GetUrlProvider } from '../get-url/get-url';
import { HttpHelperProvider } from '../http-helper/http-helper';

@Injectable()
export class CustomerServiceProvider {

  constructor(public http: HttpClient, public accessTokenHelperPro: AccessTokenHelperProvider, public getUrlPro: GetUrlProvider, public httpHelperPro: HttpHelperProvider) {
    let token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      this.accessTokenHelperPro.SetAccessToken = token;
    }
  }

  login(account) {
    return this.http.post(this.getUrlPro.getUrl + '/api/token', 'grant_type=password&username=' + account.username + '&password=' + account.password);
  }

  logout() {
    this.accessTokenHelperPro.SetAccessToken = null;
  }

  getUserInfo() {
  }

}
