import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class FilterSupportProvider {
  private FilterSearch: BehaviorSubject<any>;
  constructor() {
    this.FilterSearch = new BehaviorSubject<any>(null);
  }
  get GetFilterSearch() {
    return this.FilterSearch.asObservable();
  }
  set SetFilterSearch(val) {
    this.FilterSearch.next(val);
  }
}
