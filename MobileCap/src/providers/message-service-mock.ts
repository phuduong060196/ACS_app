import {Injectable} from '@angular/core';
import messages from './mock-messages';

@Injectable()
export class MessageService {

  messageCounter: number = 0;
  messages: Array<any> = messages;

  constructor() {
      // console.log('mock messages: ', messages);
      // console.log(this.messages)
  }

  findById(id) {
    // console.log(id)
    return Promise.resolve(this.messages[id - 1]);
  }

  getMessages() {
    return this.messages;
  }

  message(message) {
    this.messageCounter = this.messageCounter + 1;
    this.messages.push({id: this.messageCounter, message: message});
    return Promise.resolve();
  }

  getItem(id) {
    for (var i = 0; i < this.messages.length; i++) {
      if (this.messages[i].id === parseInt(id)) {
        return this.messages[i];
      }
    }
    return null;
  }

  delMessage(message) {
    this.messages.splice(this.messages.indexOf(message), 1);
  }

}
