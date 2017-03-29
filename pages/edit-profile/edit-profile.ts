import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder,FormGroup } from '@angular/forms';
import { TranslateService } from "ng2-translate";
import { MyData } from '../../providers/my-data';

import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
	
	profileForm: FormGroup;
	public name:any;
	public school_name:any;
	public race:any;
	public gender:any;
	public class_id:any;
	public email:any;
	public classes:any;

	public profile_data:Array<Object>;

	constructor(public navCtrl: NavController, public alertCtrl: AlertController,public loadingCtrl: LoadingController,public translate: TranslateService,public navParams: NavParams,public mydata: MyData,public _builder: FormBuilder, public toastCtrl: ToastController) {
		this.loadProfile();
		this.loadPeople();
		this.refreshUserData();
		this.profileForm = _builder.group({
			name: ['', Validators.required],
			academic_year_id: ['', Validators.required],
			gender: ['', Validators.required],
			race: ['', Validators.required],
			school: ['', Validators.required],
		});
	}

	goBack(){
		this.navCtrl.push(DashboardPage);
    }
    
	loadPeople(){
		this.mydata.load()
		.then(data => {
		  this.classes = data.classes;
		});
   }

	loadProfile(){
		this.email = this.mydata.user_email;
		let user_email = this.mydata.user_email;
		let user_id = this.mydata.user_id;
		this.mydata.checkEmailinApi(user_email).then(data => {
			if(data != "Not Found"){
				let js_data1 = JSON.stringify(data);
		    	let jd = JSON.parse(js_data1);
				let display_name = jd[0].GoogleUsers.name;
				let email = jd[0].GoogleUsers.email;
				let gender = jd[0].GoogleUsers.gender;
				let race = jd[0].GoogleUsers.race;
				let school_name = jd[0].GoogleUsers.school;
				let classd = jd[0].GoogleUsers.academic_year_id ;
				let api_user_id = jd[0].GoogleUsers.id;
				
				this.mydata.database.executeSql("UPDATE login SET api_user_id = "+api_user_id+",class_id="+classd+", name='"+display_name+"', email='"+email+"', gender="+gender+", race="+race+", school_name='"+school_name+"' WHERE id="+user_id+"  ", []).then((data) => {
					
				}, (error) => {
					alert("Error occured while updating.");
				});
			}
		});
	}

	refreshUserData(){
		let user_email = this.mydata.user_email;
		let user_id = this.mydata.user_id;
		this.mydata.database.executeSql("SELECT * FROM login WHERE email = '"+user_email+"' AND id="+user_id+"  ", []).then((data) => {
			this.profile_data=[];
			if(data.rows.length > 0){
				for(var i = 0; i < data.rows.length; i++) {
                    this.profile_data.push({name: data.rows.item(i).name, class_id: data.rows.item(i).class_id,gender:data.rows.item(i).gender,race:data.rows.item(i).race,school:data.rows.item(i).school_name});
                  	this.name = data.rows.item(i).name;
                  	this.profileForm.value.name = data.rows.item(i).name;
					this.school_name = data.rows.item(i).school_name;
					this.profileForm.value.school = data.rows.item(i).school_name;
					this.race = data.rows.item(i).race;
					this.profileForm.value.race = data.rows.item(i).race;
					this.gender = data.rows.item(i).gender;
					this.profileForm.value.gender = data.rows.item(i).gender;
					this.class_id = data.rows.item(i).class_id;
                }
			}
		});
	}

	updateProfile(){
		let email = this.mydata.user_email;
		let user_id = this.mydata.user_id;
		let api_user_id = this.mydata.api_user_id;

		let loader = this.loadingCtrl.create({
			content: "Updating..."
		});
		loader.present();
		let signupData = this.profileForm.value;
		this.mydata.updateSignupData(signupData,api_user_id)
		.then(data => {
			loader.dismiss();
			if(data != ""){
				let display_name = this.profileForm.value.name;
				let gender = this.profileForm.value.gender;
				let race = this.profileForm.value.race;
				let school_name = this.profileForm.value.school;
				let classd = this.profileForm.value.academic_year_id ;
				
				let class_title;
				for(var i=0;i<this.classes.length;i++){
					if(classd == this.classes[i].ClassLevel.id){
						class_title = this.classes[i].ClassLevel.title;
					}
				}

				this.mydata.database.executeSql("UPDATE login SET api_user_id = "+api_user_id+",class_id="+classd+",class_name='"+class_title+"', name='"+display_name+"', email='"+email+"', gender="+gender+", race="+race+", school_name='"+school_name+"' WHERE id="+user_id+"  ", []).then((data) => {
					let toast = this.toastCtrl.create({
				      message: 'Profile Updated Successfully',
				      duration: 3000,
				      position: 'bottom',
				      showCloseButton: true,
					  closeButtonText: 'Ok',
					  cssClass: "toast-message"
				    });
			    toast.present();
					
				}, (error) => {
					alert("Error occured while updating.");
				});
			}
		});
	}

}
