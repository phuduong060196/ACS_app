import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AgmCoreModule } from '@agm/core';

import { foodIonicApp } from './app.component';

import { PipesModule } from '../pipes/pipes.module';

import {MessageService} from "../providers/message-service-mock";
import {RestaurantService} from "../providers/restaurant-service-mock";
import {DishService} from "../providers/dish-service-mock";
import {CategoryService} from "../providers/category-service-mock";
import {CartService} from "../providers/cart-service-mock";
import {OrdersService} from "../providers/orders-service-mock";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { AccessTokenHelperProvider } from '../providers/access-token-helper/access-token-helper';
import { GetUrlProvider } from '../providers/get-url/get-url';
import { HttpHelperProvider } from '../providers/http-helper/http-helper';
import { LoadingHelperProvider } from '../providers/loading-helper/loading-helper';
import { CustomerServiceProvider } from '../providers/customer-service/customer-service';
import { SupplierServiceProvider } from '../providers/supplier-service/supplier-service';

@NgModule({
  declarations: [
    foodIonicApp
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
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    foodIonicApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    RestaurantService,
    DishService,
    CategoryService,
    MessageService,
    CartService,
    OrdersService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AccessTokenHelperProvider,
    GetUrlProvider,
    HttpHelperProvider,
    LoadingHelperProvider,
    CustomerServiceProvider,
    SupplierServiceProvider
  ]
})
export class AppModule {}
