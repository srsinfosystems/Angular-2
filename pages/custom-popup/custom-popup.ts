import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';


@Component({
  selector: 'page-custom-popup',
  templateUrl: 'custom-popup.html'
})
export class CustomPopupPage {

  constructor(public navCtrl: NavController,private navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('Hello CustomPopupPage Page');
  }

}
