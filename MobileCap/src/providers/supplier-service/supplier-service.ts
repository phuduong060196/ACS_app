import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AccessTokenHelperProvider } from '../access-token-helper/access-token-helper';
import { GetUrlProvider } from '../get-url/get-url';
import { HttpHelperProvider } from '../http-helper/http-helper';

@Injectable()
export class SupplierServiceProvider {

  constructor(public http: HttpClient, public accessTokenHelperPro: AccessTokenHelperProvider, public getUrlPro: GetUrlProvider, public httpHelperPro: HttpHelperProvider) {
    let token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      this.accessTokenHelperPro.SetAccessToken = token;
    }
  }

  getAllSuppliers(){
    return this.httpHelperPro.get(this.getUrlPro.getUrl + '/api/supplier/search?name=&searchBy=price&sort=desc').subscribe(
      (res) => {
        return res;
      },
      (err) => {
        return err;
      }
    );
  }
}
