import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder,FormGroup } from '@angular/forms';
import { TranslateService } from "ng2-translate";
import { MyData } from '../../providers/my-data';
import { GettingStartedPage } from '../getting-started/getting-started';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
   loginForm: FormGroup;
   public classes:any;
   public userDetails:any;
   
   constructor(public navCtrl: NavController, public alertCtrl: AlertController,public loadingCtrl: LoadingController,public translate: TranslateService,public navParams: NavParams,public mydata: MyData,public _builder: FormBuilder) {
		this.navCtrl = navCtrl;
		this.loadPeople();
		this.userDetails = this.navParams.get('userdata');
		
		this.loginForm = _builder.group({
			name: ['', Validators.required],
			academic_year_id: ['', Validators.required],
			gender: ['', Validators.required],
			race: ['', Validators.required],
			school: ['', Validators.required],
		});
   }
   
   loadPeople(){
		this.mydata.load()
		.then(data => {
		  this.classes = data.classes;
		});
   }
  
   create_profile(){
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present();
		this.loginForm.value.email = this.userDetails.email;
		let signupData = this.loginForm.value;
		let token = this.userDetails.idToken;

		this.mydata.insertSignupData(signupData)
		.then(data => {
			loader.dismiss();
			if(data != ""){
				let js_data1 = JSON.stringify(data);
				let jd = JSON.parse(js_data1);

				let display_name = jd.GoogleUsers.name;
				let email = jd.GoogleUsers.email;
				let gender = jd.GoogleUsers.gender;
				let race = jd.GoogleUsers.race;
				let school_name = jd.GoogleUsers.school;
				let classd = jd.GoogleUsers.academic_year_id ;
				let api_user_id = jd.GoogleUsers.api_user_id;
				let class_title;
				for(var i=0;i<this.classes.length;i++){
					if(classd == this.classes[i].ClassLevel.id){
						class_title = this.classes[i].ClassLevel.title;
					}
				}

				this.mydata.database.executeSql("INSERT INTO login (api_user_id, class_id, class_name, name, email, gender, race, school_name, token) VALUES ("+api_user_id+","+classd+",'"+class_title+"','"+display_name+"', '"+email+"',"+gender+","+race+",'"+school_name+"','"+token+"')", []).then((data) => {
					this.mydata.user_id = data.insertId;
					this.mydata.user_email = email;
					this.mydata.api_user_id =api_user_id;
					this.navCtrl.push(GettingStartedPage);
					let alert1 = this.alertCtrl.create({
					  title: 'Signup Successfull!',
					  subTitle: 'Congrats! Signup Successfull',
					  buttons: ['OK']
					});
					alert1.present();
				}, (error) => {
					alert('Thers is some problem in login.Please try again later');
				});
			}
		});
   }
}
