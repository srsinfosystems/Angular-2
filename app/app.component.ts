import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';

import { TranslateService } from 'ng2-translate';

import { MyData } from '../providers/my-data';
import { HomePage } from '../pages/home/home';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;
  
  constructor(platform: Platform, translate: TranslateService,mydata: MyData) {
    platform.ready().then(() => {
    
		  StatusBar.styleDefault();
		  Splashscreen.hide();
		  translate.setDefaultLang('en');
		  translate.use('en');
		
			let db = new SQLite();
  
			db.openDatabase({
				name: "data.db",
				location: "default"
			}).then(() => {
				db.executeSql("CREATE TABLE IF NOT EXISTS login (id INTEGER PRIMARY KEY AUTOINCREMENT, api_user_id INTEGER,class_id INTEGER,class_name TEXT,name TEXT, email TEXT, gender INTEGER, race INTEGER, school_name TEXT, token TEXT)", {}).then((data) => {
					console.log("TABLE CREATED: ", data);
				}, (error) => {
					console.error("Unable to execute sql", error);
				})
				
				db.executeSql("CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY AUTOINCREMENT, academic_year_id TEXT, subject_id INTEGER, subject_data TEXT, subject_status INTEGER)", {}).then((data) => {
					//alert("Subject TABLE CREATED ");
				}, (error) => {
					console.error("Unable to execute sql", error);
				})
				
				db.executeSql("CREATE TABLE IF NOT EXISTS chapters (id INTEGER PRIMARY KEY AUTOINCREMENT, academic_year_id TEXT,subject_id INTEGER, chapter_id INTEGER, chapter_data TEXT, chapter_status INTEGER)", {}).then((data) => {
					//alert("Chapters TABLE CREATED: ");
				}, (error) => {
					console.error("Unable to execute sql", error);
				})
				
				db.executeSql("CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, academic_year_id TEXT,subject_id INTEGER,chapter_id INTEGER,question_id INTEGER,question_data TEXT, question_status INTEGER)", {}).then((data) => {
					//alert("Questions TABLE CREATED: ");
				}, (error) => {
					console.error("Unable to execute sql", error);
				})
			}, (error) => {
				console.error("Unable to open database", error);
			});
    });
  }
}
