import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HaventecAuthenticateClient } from '@haventec/authenticate-client-js';
import { ChooseUserPage } from '../pages/choose-user/choose-user';
import { LoginPage } from '../pages/login/login';
import { LogService } from '../providers/log-service/log-service';
import { TranslateService } from '@ngx-translate/core';
import {Storage} from "@ionic/storage";
import * as Constant from '../constants/application.const'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild("content") navCtrl: NavController;

  rootPage: any;
  private language = 'en';

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private storage: Storage,
    private logService: LogService,
    private haventecAuthenticateClient: HaventecAuthenticateClient,
    private translateService: TranslateService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.translateService.setDefaultLang(this.language);
      this.setLang(this.language);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // You can find your Application UUID in the application section at https://console.haventec.com
      // The API_ENDPOINT is the full URL to your backend APIs e.g https://your-api-domain.com
      this.haventecAuthenticateClient.init(Constant.APPLICATION_UUID, Constant.API_ENDPOINT);

      this.checkAppConfig();
      this.checkForFirstTimeUse();
    });
  }

  // Reset the App and return the user to the Sign up page
  resetApp(page) {
    this.haventecAuthenticateClient.purge();
    this.storage.remove('ha_auth_method');
    this.logService.debug('Resetting App');
    this.navCtrl.setRoot(ChooseUserPage);
  }

  // Check if this is the users first time using the App
  checkForFirstTimeUse(): void {

    let username = this.haventecAuthenticateClient.getUsername();
    if(username != null && this.haventecAuthenticateClient.getAuthKey() != null) {
      this.logService.debug('Not First time use');
      this.rootPage = LoginPage;
    } else {
      this.logService.debug('First time use');
      this.rootPage = ChooseUserPage;
    }
  };

  logout() {
    this.haventecAuthenticateClient.logout().then(
      data => {},
      err => {this.logService.error(err);
      });

    this.navCtrl.setRoot(LoginPage);
  }

  setLang(language) {
    console.log('You have chosen the language: ' + language);
    this.translateService.use(language)
  }

  checkAppConfig(){
    if(Constant.APPLICATION_UUID === '' || Constant.API_ENDPOINT === '') {
      this.logService.error('Please configure your Application UUID and API endpoint in application.const.ts');
    }
  }
}
