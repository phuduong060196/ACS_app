import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {MessageService} from '../../providers/message-service-mock';

@IonicPage({
	name: 'page-message-list',
	segment: 'message-list'
})

@Component({
    selector: 'page-message-list',
    templateUrl: 'message-list.html'
})
export class MessageListPage {

    messages: Array<any> = [];

    constructor(public navCtrl: NavController, public service: MessageService) {
        this.getMessages();
        // console.log(this.messages);
    }

    itemTapped(message) {
        // console.log('itemTapped: ', message);
        this.navCtrl.push('page-message-detail', {
	      'id': message.id
	    });
    }

    deleteItem(message) {
        this.service.delMessage(message);
    }

    getMessages() {
        this.messages = this.service.getMessages();
    }

}
