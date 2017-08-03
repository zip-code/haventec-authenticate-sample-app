import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth-service/auth-service';
import {HaventecCommon} from '@haventec/common-js';
import { LogService } from '../../providers/log-service/log-service';

@Component({
  selector: 'page-forgot-pin',
  templateUrl: 'forgot-pin.html',
})
export class ForgotPinPage {

  public username: string;

  private resetFormGroup : FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private logService: LogService,
    private haventecCommon: HaventecCommon) {

    const self: any = this;

    self.resetFormGroup = self.formBuilder.group({
      resetPinToken: ['', Validators.required],
      pin: ['', Validators.required],
    })

    self.username = self.haventecCommon.getUsername();

  }

  pinUpdated(pin){
    if(pin.length === 4){
      this.resetFormGroup.controls['pin'].setValue(pin);
    }
  }

  resetPin(){
    const self: any = this;

    self.username = self.haventecCommon.getUsername();
    let deviceUuid = self.haventecCommon.getDeviceUuid();
    let hashedPin = self.haventecCommon.getHashPin(self.resetFormGroup.value.pin);
    let resetPinToken = self.resetFormGroup.value.resetPinToken;

    self.authService.resetPin(self.username, deviceUuid, hashedPin, resetPinToken).subscribe(
      data => {
        self.logService.debug('Auth key: ' + data.authKey);

        self.haventecCommon.updateDataFromResponse(data);
          self.navCtrl.setRoot(HomePage);
      },
      err => {
        self.logService.error(err);
      }
    );
  }
}
