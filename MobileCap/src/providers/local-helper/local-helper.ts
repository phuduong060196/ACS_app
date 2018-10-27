import { BehaviorSubject } from 'rxjs';

export class LocalHelperProvider {

  private Location: BehaviorSubject<any>;

  constructor(){
    this.Location = new BehaviorSubject(null);
  }

  get GetLocation() {
    return this.Location.asObservable();
  }

  set SetLocation(val) {
    this.Location.next(val);
  }

}
