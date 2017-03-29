import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController, Platform } from 'ionic-angular';

import { SQLite } from "ionic-native";
import 'rxjs/add/operator/map';

declare var navigator: any;
declare var Connection: any;

@Injectable()
export class MyData {

	data: any;
	chapters: any;
	questions: any;
	signupresponse:any;

	chapterFlag:any;

	public user_id:any;
	public api_user_id:any;
	public user_email:any;

	public classes_data:any;
	public signupDetails:any;

	public network_status:any;
	public database: SQLite;
	public subject_d: Array<Object>;
	public chapter_flag:any;

	constructor(public http: Http, public alertCtrl: AlertController,public platform: Platform) {
		
		this.platform.ready().then(() => {
			//Check status Internet connection
            var networkState = navigator.connection.type;
            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';
            this.network_status = states[networkState];
            
            //Get Database Details
            this.database = new SQLite();
            this.database.openDatabase({name: "data.db", location: "default"}).then(() => {
               //this.checkUserDb();
            }, (error) => {
				alert("Database Error");
                console.log("ERROR: ", error);
            });
            
        });
	}

	load() {
	 if (this.data) {
		return Promise.resolve(this.data);
	  }
	  return new Promise(resolve => {
		
		this.http.get('http://192.168.1.20/users.json').map(res => res.json())
		//this.http.get('api/users.json').map(res => res.json())
		  .subscribe(data => {
			this.data = data;
			this.classes_data = data.classes;
			resolve(this.data);
		  });
	  });
	}
  
	getDbChapters(arr1){
		let arr2 = JSON.parse(arr1);
		let subject_id = arr2[0].id;
		let academicid = arr2[0].academicid;
		return new Promise(resolve => {
		this.http.get('http://192.168.1.20/rest_chapters/'+subject_id+'.json?aid='+academicid).map(res => res.json())
		//this.http.get('api/rest_chapters/'+subject_id+'.json').map(res => res.json())
		  .subscribe(data => {
			this.chapters = data.chapters;
			//this.chapters = data;
			resolve(this.chapters);
		  });
	  	});
		
	}

	getDbQuestions(que_arr){
		let arr2 = JSON.parse(que_arr);
		let chapter_id = arr2[0].chapter_id;
		let subject_id = arr2[0].subject_id;
		let academicid = arr2[0].academicid;

		return new Promise(resolve => {
		this.http.get('http://192.168.1.20/rest_questions/'+chapter_id+'.json?aid='+academicid+'&subid='+subject_id).map(res => res.json())
		  .subscribe(data => {
			this.questions = data.questions;
			//this.questions = data;
			resolve(this.questions);
		  });
	  });
		
	}

	insertSignupData(data){
		return new Promise(resolve => {
			this.http.post('http://192.168.1.20/rest_signup.json', data).map(res => res.json())
			.subscribe(data => {
			 this.api_user_id = data.user.GoogleUsers.api_user_id;
			 this.signupresponse = data.user;
			 resolve(this.signupresponse);
			}, error => {
				console.log("Oooops!");
			});
		});
	}

	checkEmailinApi(d){
		return new Promise(resolve => {
			this.http.get('http://192.168.1.20/rest_signup/detail.json?email='+d).map(res => res.json())
			.subscribe(data => {
			 this.signupDetails = data.user;
			 resolve(this.signupDetails);
			}, error => {
				console.log("Oooops!");
			});
		});
	}

	updateSignupData(data,id){
		return new Promise(resolve => {
			this.http.post('http://192.168.1.20/rest_signup/updateSignup/'+id+'.json', data).map(res => res.json())
			.subscribe(data => {
			 this.signupresponse = data.message;
			 resolve(this.signupresponse);
			}, error => {
				console.log("Oooops!");
			});
		});
	}
	
	


	localStorageChapter(data,subject_status){
		this.getDbChapters(data)
	    .then(data => {
	      if(data != ""){
	      	
	        let js_data1 = JSON.stringify(data);
	        let jd = JSON.parse(js_data1);

	        for(var i=0;i< jd.length;i++){
	          this.subject_d = [];
	          this.subject_d.push({title: jd[i].Chapters.title});

	          let js_data = JSON.stringify(this.subject_d);
	          let chapter_id = jd[i].Chapters.id;
	          let academic_id = jd[i].Chapters.academic_year_id;
	          let subject_id = jd[i].Chapters.subject_id;
	          let status = subject_status;

	          this.database.executeSql("SELECT * FROM chap WHERE chapter_id = "+chapter_id+" AND subject_id = "+subject_id+"  AND academic_year_id = '"+academic_id+"' ", []).then((data) => {
	            if(data.rows.length == 0) {
	              this.database.executeSql("INSERT INTO chap (academic_year_id,subject_id,chapter_id,chapter_data,chapter_status) VALUES ('"+academic_id+"',"+subject_id+","+chapter_id+",'"+js_data+"',"+status+")", []).then((data) => {
	              		let arr=[];
    					arr.push({chapter_id:chapter_id,subject_id:subject_id,academicid:academic_id});
	                	this.localStorageQuestion(JSON.stringify(arr),status);

	              }, (error) => {
	                alert('Thers is some problem in login.Please try again later');
	              });
	            }else{
	              this.database.executeSql("UPDATE chapters SET academic_year_id = '"+academic_id+"', chapter_data = '"+js_data+"',chapter_status = "+status+" WHERE subject_id = "+subject_id+" AND chapter_id = "+chapter_id+" ", []).then((data) => {
	                	let arr=[];
    					arr.push({chapter_id:chapter_id,subject_id:subject_id,academicid:academic_id});
	                	this.localStorageQuestion(JSON.stringify(arr),status);

	              }, (error) => {
	                alert('Thers is some problem in Updating');
	              });
	            }
	          }, (error) => {
	            alert("Error Found");
	          });
	          
	        }
	      }
	     });
	}

	localStorageQuestion(data,chapter_status){
		this.getDbQuestions(data)
	    .then(data => {
			if(data != ""){
				let js_data1 = JSON.stringify(data);
				let jd = JSON.parse(js_data1);
				for(var i=0;i< jd.length;i++){
					this.subject_d = [];
					this.subject_d.push({title: jd[i].Questions.title});
					
					let js_data = JSON.stringify(this.subject_d);
					let question_id = jd[i].Questions.id;
					let academic_id = jd[i].Questions.academic_year_id;
					let subject_id = jd[i].Questions.subject_id;
					let chapter_id = jd[i].Questions.chapter_id;
					let status = chapter_status;

					this.database.executeSql("SELECT * FROM questions WHERE question_id = "+question_id+" AND chapter_id = "+chapter_id+" AND subject_id = "+subject_id+"  AND academic_year_id = '"+academic_id+"' ", []).then((data) => {
						if(data.rows.length == 0) {
							this.database.executeSql("INSERT INTO questions (question_id,academic_year_id,subject_id,chapter_id,question_data,question_status) VALUES ("+question_id+",'"+academic_id+"',"+subject_id+","+chapter_id+",'"+js_data+"',"+status+")", []).then((data) => {
								
							}, (error) => {
								alert('Thers is some problem in saving questions.Please try again later');
							});
						}else{
							this.database.executeSql("UPDATE questions SET academic_year_id = '"+academic_id+"', question_data = '"+js_data+"',question_status = "+status+" WHERE subject_id = "+subject_id+" AND chapter_id = "+chapter_id+" AND question_id = "+question_id+"", []).then((data) => {
								
							}, (error) => {
								alert('Thers is some problem in Updating questions');
							});
						}
					});
				}
			}
	   });
	}



	logout(){

		window['plugins'].googleplus.logout(
		    function (msg) {
		      //alert(msg); // do something useful instead of alerting
		    }
		);
	}


}
