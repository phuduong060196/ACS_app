import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class FcmProvider {

  constructor
    (
    private platform: Platform,
    public firebase: Firebase,
    public angularFirestore: AngularFirestore
    ) {
    angularFirestore.firestore.settings({ timestampsInSnapshots: true });
  }

  async getToken() {
    let token;
    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }
    return this.saveTokenToFirestore(token)
  }

  private saveTokenToFirestore(token) {
    if (!token) return;
    const devicesRef = this.angularFirestore.collection('devices');
    const docData = {
      token,
      CustomerId: 3
    }
    return devicesRef.doc(token).set(docData);
  }

  listenToNotifications() {
    return this.firebase.onNotificationOpen();
  }

}
