import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { HaventecAuthenticateClient } from '@haventec/authenticate-client-js';
import { ChooseUserPage } from '../choose-user/choose-user';
import { HomePage } from '../home/home';
import { LogService } from '../../providers/log-service/log-service';
import { PageLoadingService } from '../../providers/page-loading-service/page-loading-service';
import {ChooseAuthMethodPage} from "../choose-authmethod/choose-authmethod";

@Component({
  selector: 'ht-page-activate-account',
  templateUrl: 'activate-account.html',
})
export class ActivateAccountPage {

  public username: string;
  private activateAccountFormGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private haventecAuthenticateClient: HaventecAuthenticateClient,
    private logService: LogService,
    private pageLoadingService: PageLoadingService
  ) {

    this.activateAccountFormGroup = this.formBuilder.group({
      pin: ['', Validators.required]
    });

    this.username = this.haventecAuthenticateClient.getUsername();
  }

  pinUpdated(pin){
    if(pin.length === 4){
      this.activateAccountFormGroup.controls['pin'].setValue(pin);
    }
  }

  activateUser() {
    let pin = this.activateAccountFormGroup.value.pin;

    let activationToken = this.navParams.get('activationToken');

    this.pageLoadingService.present();

    this.haventecAuthenticateClient.activateUser(this.username, activationToken, pin).then(
      data => {
        this.pageLoadingService.dismiss();
        this.navCtrl.setRoot(HomePage);
      },
      err => {
        this.logService.error(err);
        this.pageLoadingService.dismiss();
      }
    );
  }

  back() {

    let fromChooseAuthMethod = this.navParams.get('fromChooseAuthMethod');
    let activationToken = this.navParams.get('activationToken');
    if ( fromChooseAuthMethod ) {
      this.navCtrl.setRoot(ChooseAuthMethodPage, {
        activationToken: activationToken
      });
    } else {
      this.navCtrl.setRoot(ChooseUserPage);
    }
  }
}
