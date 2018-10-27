import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LocalHelperProvider } from '../../providers/local-helper/local-helper';


declare var google;

@IonicPage({
  name: 'page-change-location',
  segment: 'change-locationr'
})

@Component({
  selector: 'page-change-location',
  templateUrl: 'change-location.html',
})


export class ChangeLocationPage {

  GoogleAutocomplete;
  autocomplete;
  autocompleteItems;
  geocoder;

  constructor(public navCtrl: NavController, public zone: NgZone, private localPro: LocalHelperProvider) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder;
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          if (predictions != null) {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          }
          else {
            this.autocompleteItems = [];
          }
        });
      }
    );
  }

  selectSearchResult(item) {
    console.log(item);
    this.autocomplete.input = item.description;
    this.autocompleteItems = [];
    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.localPro.SetLocation = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
          yourLocation: item.description
        }
      }
    });
  }

  closeModal() {
    this.navCtrl.pop();
  }

}
