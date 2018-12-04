import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class CloseModalProvider {
  private IsCloseModal: BehaviorSubject<any>;
  constructor() {
    this.IsCloseModal = new BehaviorSubject<any>(false);
  }
  get GetIsCloseModal() {
    return this.IsCloseModal.asObservable();
  }
  set SetIsCloseModal(val) {
    this.IsCloseModal.next(val);
  }
}
