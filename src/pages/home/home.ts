import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { HaventecClient } from '@haventec/common-js';
import { UserService } from '../../providers/user-service/user-service';
import { UserModel } from '../../models/user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public username: string;
  public accessToken: string;
  public authKey: string;
  public user: UserModel = new UserModel();

  constructor(
    private alertCtrl: AlertController,
    private haventecClient: HaventecClient,
    private userService: UserService
  ){
    this.username = this.haventecClient.getUsername();
    this.accessToken = this.haventecClient.getAccessToken();
    this.authKey = this.haventecClient.getAuthKey();
    this.getUserDetails();
    this.getUserDevices();
  }

  private getUserDetails(){
    this.userService.getUserDetails().then(
      data => {
        this.user.setData(data)
      },
      err => {}
    );
  }

  private getUserDevices(){
    // this.userService.getUserDevices().then(
    //   data => {
    //     console.log(data);
    //   },
    //   err => {}
    // );
  }

  showAuthKey() {
      let alert = this.alertCtrl.create({
        title: 'Your unique Authentication Key',
        subTitle: this.authKey,
        buttons: ['OK']
      });
      alert.present();
    }
}
