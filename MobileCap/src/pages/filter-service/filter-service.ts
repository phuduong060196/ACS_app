import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FilterSupportProvider } from '../../providers/filter-support/filter-support';

@IonicPage({
  name: 'page-filter-service',
  segment: 'filter-service'
})

@Component({
  selector: 'page-filter-service',
  templateUrl: 'filter-service.html',
})
export class FilterServicePage implements OnInit {

  filterValue: any;

  constructor(private filterSupport: FilterSupportProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    this.filterSupport.GetFilterSearch.subscribe(
      (val) => {
        if (val) {
          this.filterValue = val;
        }
      }
    );
  }

  closeModal() {
    this.navCtrl.pop();
  }

  confirmAction() {
    this.filterSupport.SetFilterSearch = this.filterValue;
    this.closeModal();
  }

}
