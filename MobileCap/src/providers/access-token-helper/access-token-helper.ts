import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class AccessTokenHelperProvider {

  private AccessToken: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {
  }

  get GetAccessToken() {
    return this.AccessToken.asObservable();
  }

  set SetAccessToken(res) {
    localStorage.setItem('token', JSON.stringify(res));
    this.AccessToken.next(res);
  }

}
