import {Component} from "@angular/core";
import {IonicPage, NavController} from "ionic-angular";

@IonicPage({
	name: 'page-settings',
	segment: 'settings'
})

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public nav: NavController) {
  }

}
