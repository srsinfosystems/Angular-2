import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule, Http } from '@angular/http';

import { MyApp } from './app.component';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

import { MyData } from '../providers/my-data';


import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { GettingStartedPage } from '../pages/getting-started/getting-started';
import { DashboardPage } from '../pages/dashboard/dashboard';

import { SubjectsPage } from '../pages/subjects/subjects';
import { SubjectChoicePage } from '../pages/subject-choice/subject-choice';
import { ChaptersPage } from '../pages/chapters/chapters';
import { QuestionPage } from '../pages/question/question';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';

import { CustomPopupPage } from '../pages/custom-popup/custom-popup';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
    GettingStartedPage,
    DashboardPage,
    SubjectsPage,
    SubjectChoicePage,
    ChaptersPage,
    QuestionPage,
    EditProfilePage,
    CustomPopupPage
  ],
  imports: [
	HttpModule,
	TranslateModule.forRoot({
	  provide: TranslateLoader,
	  useFactory: (createTranslateLoader),
	  deps: [Http]
	}),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    GettingStartedPage,
    DashboardPage,
    SubjectsPage,
    SubjectChoicePage,
    ChaptersPage,
    QuestionPage,
    EditProfilePage,
    CustomPopupPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},MyData]
})
export class AppModule {}
