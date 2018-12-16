import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LocalHelperProvider } from '../../providers/local-helper/local-helper';


declare var google;

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
    latC: any;
    lngC: any;
    yourLocationC: any;

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
                this.latC = results[0].geometry.location.lat();
                this.lngC = results[0].geometry.location.lng();
                this.yourLocationC = item.description;
            }
        });
    }

    closeModal() {
        this.navCtrl.pop();
    }

    confirmAction() {
        if (this.latC && this.lngC && this.yourLocationC) {
            this.localPro.SetLocation = {
                lat: this.latC,
                lng: this.lngC,
                yourLocation: this.yourLocationC
            }
        }
        this.navCtrl.pop();
    }

}
