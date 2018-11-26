import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class AccessTokenHelperProvider {

  private AccessToken: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {
  }

  get GetAccessToken() {
    return this.AccessToken.asObservable();
  }

  set SetAccessToken(res) {
    if(res){
      localStorage.setItem('token', JSON.stringify(res));
    }else{
      localStorage.removeItem('token');
    }
    this.AccessToken.next(res);
  }

}
