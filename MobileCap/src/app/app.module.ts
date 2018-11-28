import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AgmCoreModule } from '@agm/core';


import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { foodIonicApp } from './app.component';

import { PipesModule } from '../pipes/pipes.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Firebase } from '@ionic-native/firebase';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { AccessTokenHelperProvider } from '../providers/access-token-helper/access-token-helper';
import { GetUrlProvider } from '../providers/get-url/get-url';
import { HttpHelperProvider } from '../providers/http-helper/http-helper';
import { LoadingHelperProvider } from '../providers/loading-helper/loading-helper';
import { CustomerServiceProvider } from '../providers/customer-service/customer-service';
import { SupplierServiceProvider } from '../providers/supplier-service/supplier-service';
import { LocalHelperProvider } from '../providers/local-helper/local-helper';
import { FcmProvider } from '../providers/fcm/fcm';
import { NotificationHelperProvider } from '../providers/notification-helper/notification-helper';
import { NumberNotificationHelperProvider } from '../providers/number-notification-helper/number-notification-helper';
import { Network } from '@ionic-native/network';

var config = {
	apiKey: "AIzaSyCxm0jQrorq3-dCoiwwTchjaIe_H6OX2H0",
	authDomain: "firestore-a792b.firebaseapp.com",
	databaseURL: "https://firestore-a792b.firebaseio.com",
	projectId: "firestore-a792b",
	storageBucket: "firestore-a792b.appspot.com",
	messagingSenderId: "651552319035"
};

@NgModule({
	declarations: [
		foodIonicApp,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		IonicModule.forRoot(foodIonicApp, {
			preloadModules: true,
			scrollPadding: false,
			scrollAssist: true,
			autoFocusAssist: false
		}),
		IonicStorageModule.forRoot({
			name: '__foodIonicDB',
			driverOrder: ['indexeddb', 'sqlite', 'websql']
		}),
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
		}),
		PipesModule,
		AngularFireModule.initializeApp(config),
		AngularFirestoreModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		foodIonicApp
	],
	providers: [
		StatusBar,
		SplashScreen,
		Keyboard,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		AccessTokenHelperProvider,
		GetUrlProvider,
		HttpHelperProvider,
		LoadingHelperProvider,
		CustomerServiceProvider,
		SupplierServiceProvider,
		NativeGeocoder,
		Geolocation,
		LocalHelperProvider,
		Firebase,
		FcmProvider,
		NotificationHelperProvider,
		NumberNotificationHelperProvider,
		InAppBrowser,
		Network
	]
})
export class AppModule {
}
