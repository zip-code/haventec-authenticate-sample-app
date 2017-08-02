import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RegisterPage } from '../register/register';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ErrorService } from '../../providers/error-service/error-service';
import {HaventecCommon} from '@haventec/common-js';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
  providers: [AuthService]
})
export class SignUpPage {

  private signUpFormGroup : FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private haventecCommon: HaventecCommon,
    private errorService: ErrorService) {
    this.signUpFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.email],
    });
  }

  signUp(){
    let username = this.signUpFormGroup.value.username;
    let email = this.signUpFormGroup.value.email;

    this.authService.signUpUser(username, email).then(
      data => {
          this.haventecCommon.init(username);
          this.navCtrl.push(RegisterPage);
      },
      err => {
        this.errorService.showError(err);
      }
    );
  }
}
