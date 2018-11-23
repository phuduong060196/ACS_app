import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { AccessTokenHelperProvider } from '../access-token-helper/access-token-helper';

@Injectable()
export class FcmProvider {

  constructor
    (
    private accessTokenHelperPro: AccessTokenHelperProvider,
    private platform: Platform,
    public firebase: Firebase,
    public angularFirestore: AngularFirestore
    ) {
    angularFirestore.firestore.settings({ timestampsInSnapshots: true });
  }

  async getToken() {
    let token;
    let currentCustomerId;
    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
      this.accessTokenHelperPro.GetAccessToken.subscribe(val => {
        if (val) {
          currentCustomerId = parseInt(JSON.parse(localStorage.getItem('token')).CustomerId);
        }
      });
    }
    return this.saveTokenToFirestore(token, currentCustomerId);
  }

  private saveTokenToFirestore(token, CustomerId) {
    if (!token) return;
    const devicesRef = this.angularFirestore.collection('devices');


    const docData = {
      token,
      CustomerId: CustomerId
    }
    return devicesRef.doc(token).set(docData);
  }

  listenToNotifications() {
    return this.firebase.onNotificationOpen();
  }

}
