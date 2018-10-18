import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

@Component({
    templateUrl: 'app.html'
})
export class foodIonicApp {
    @ViewChild(Nav) nav: Nav;

    tabsPlacement: string = 'bottom';
    tabsLayout: string = 'icon-top';

    rootPage: any = 'page-auth';
    showMenu: boolean = true;

    homeItem: any;

    initialItem: any;

    messagesItem: any;

    cartItem: any;

    settingsItem: any;

    appMenuItems: Array<MenuItem>;

    yourRestaurantMenuItems: Array<MenuItem>;

    accountMenuItems: Array<MenuItem>;

    helpMenuItems: Array<MenuItem>;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
        this.initializeApp();
        this.homeItem = { component: 'page-home' };
        this.messagesItem = { component: 'page-message-list' };
        this.cartItem = { component: 'page-cart' };
        this.accountMenuItems = [
            { title: 'Đăng nhập', component: 'page-auth', icon: 'log-in' },
            { title: 'Tài khoản', component: 'page-my-account', icon: 'contact' },
            { title: 'Đăng xuất', component: 'page-auth', icon: 'log-out' },
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.overlaysWebView(false);
            this.splashScreen.hide();
        });

        if (!this.platform.is('mobile')) {
            this.tabsPlacement = 'top';
            this.tabsLayout = 'icon-left';
        }
    }

    openPage(page) {
        if (page.component) {
            this.nav.setRoot(page.component);
        } else {

        }
    }
}
