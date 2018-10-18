import { Component } from '@angular/core';

/**
 * Generated class for the ServiceCartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'service-cart',
  templateUrl: 'service-cart.html'
})
export class ServiceCartComponent {

  text: string;

  constructor() {
    console.log('Hello ServiceCartComponent Component');
    this.text = 'Hello World';
  }

}
