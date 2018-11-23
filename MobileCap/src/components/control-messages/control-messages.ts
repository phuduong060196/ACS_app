import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../../providers/validation.service';

@Component({
  selector: 'control-messages',
  templateUrl: 'control-messages.html'
})
export class ControlMessagesComponent {

  @Input() control: FormControl;

  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidationErrorMessage(propertyName);
      }
    }
    return null;
  }

}
