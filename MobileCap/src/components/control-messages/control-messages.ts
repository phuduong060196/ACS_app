import { Component, Input } from '@angular/core';
import { ValidationService } from '../../providers/validation.service';

@Component({
  selector: 'control-messages',
  templateUrl: 'control-messages.html'
})
export class ControlMessagesComponent {

  @Input() control = null;
  constructor() {
  }

  get errorMessage() {
    if (this.control) {
      for (let propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
          return ValidationService.getValidationErrorMessage(propertyName);
        }
      }
    }
    return null;
  }

}
