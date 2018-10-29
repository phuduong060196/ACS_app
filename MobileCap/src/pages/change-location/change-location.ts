import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  name: 'page-change-location',
  segment: 'change-location'
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


  constructor(public navCtrl: NavController, public zone: NgZone) {
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
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
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
        console.log(results[0].geometry.location.lat());
        console.log(results[0].geometry.location.lng());
      }
    });
  }

  closeModal() {
    this.navCtrl.pop();
  }

}
