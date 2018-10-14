import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AgmCoreModule } from '@agm/core';
// import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { foodIonicApp } from './app.component';

import { PipesModule } from '../pipes/pipes.module';

import {MessageService} from "../providers/message-service-mock";
import {RestaurantService} from "../providers/restaurant-service-mock";
import {DishService} from "../providers/dish-service-mock";
import {CategoryService} from "../providers/category-service-mock";
import {CartService} from "../providers/cart-service-mock";
import {OrdersService} from "../providers/orders-service-mock";

@NgModule({
  declarations: [
    foodIonicApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(foodIonicApp, {
			preloadModules: true,
			iconMode: 'md',
			mode: 'md'
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
    RestaurantService,
    DishService,
    CategoryService,
    MessageService,
    CartService,
		OrdersService,
    // { provide: LocationStrategy, useClass: PathLocationStrategy },
    // { provide: APP_BASE_HREF, useValue : '/' },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
