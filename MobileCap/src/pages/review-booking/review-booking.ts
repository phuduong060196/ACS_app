import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { CloseModalProvider } from '../../providers/close-modal/close-modal';


@IonicPage({
  name: 'page-review-booking',
  segment: 'review-booking'
})
@Component({
  selector: 'page-review-booking',
  templateUrl: 'review-booking.html',
})
export class ReviewBookingPage implements OnInit {

  inforBooking: any;
  listService: any;
  total: any

  constructor(private closeModalPro: CloseModalProvider, private alertCtrl: AlertController, private database: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.inforBooking = this.navParams.get('inforBooking');
  }

  ngOnInit() {
    if (this.inforBooking) {
      this.total = 0;
      this.listService = this.inforBooking.Order.OrderDetails;
      console.log(this.listService);
      this.listService.forEach(element => {
        this.total = this.total + (element.Price * element.Quantity);
      });
    }
  }

  sendBookingRequest() {
    if (this.inforBooking) {
      this.database.collection('booking').add(this.inforBooking);
      this.alertCtrl.create({
        title: 'Thông báo',
        message: 'Đặt dịch vụ thành công!',
        buttons: [{
          text: 'Xác nhận',
          handler: () => {
            this.closeModal();
            this.closeModalPro.SetIsCloseModal = true;
          }
        }]
      }).present();
    }
  }

  closeModal() {
    this.navCtrl.pop();
  }
}
