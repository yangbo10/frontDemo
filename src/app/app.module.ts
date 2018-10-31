import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {DiagnosisComponent} from './diagnosis/diagnosis.component';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {ReportComponent} from './report/report.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {TaskService} from './service/taskService';
import { HttpModule } from '@angular/http';
import { QuestionboxComponent } from './questionbox/questionbox.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import { ChartModule } from 'angular2-highcharts';
import {NgxUploaderModule} from 'ngx-uploader';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import {User} from './models/user';
import { ContactComponent } from './contact/contact.component';


const appChildRoutes: Routes = [
  {
    path: 'diagnosis',
    component: DiagnosisComponent
  },
  {
    path: 'questionnaire',
    component: QuestionnaireComponent
  },
  {
    path: 'report',
    component: ReportComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  }
];

export const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    children: appChildRoutes
  }
  ];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DiagnosisComponent,
    QuestionnaireComponent,
    ReportComponent,
    QuestionboxComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    Ng2SmartTableModule,
    ChartModule,
    NgxUploaderModule,
    ModalModule,
    NgxEchartsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [TaskService, User],
  bootstrap: [AppComponent]
})
export class AppModule { }