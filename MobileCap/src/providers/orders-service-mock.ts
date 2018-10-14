import {Injectable} from '@angular/core';

@Injectable()
export class OrdersService {

  orderCounter: number = 0;
  orders: Array<any> = [];

  saveOrder(order, total, orderNumber) {
    this.orderCounter = this.orderCounter + 1;
    this.orders.push({id: this.orderCounter, order: order, total: total, onumber: orderNumber});
    return Promise.resolve();
  }

  getOrders() {
    return Promise.resolve(this.orders);
  }

}
