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
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TaskService} from './service/taskService';
import {Http, HttpModule} from '@angular/http';
import { QuestionboxComponent } from './questionbox/questionbox.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import { ChartModule } from 'angular2-highcharts';
import {NgxUploaderModule} from 'ngx-uploader';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import {User} from './models/user';
import { ContactComponent } from './contact/contact.component';
import { UsermanageComponent } from './usermanage/usermanage.component';
import { TestmanageComponent } from './testmanage/testmanage.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from 'ng2-translate/ng2-translate';
import {ScrollEventModule} from 'ngx-scroll-event';
import { FlowchartComponent } from './flowchart/flowchart.component';
import {GlobalLanguageEventService} from './service/global-language-event.service';
import { SmalltableComponent } from './smalltable/smalltable.component';

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
  },
  {
    path: 'user',
    component: UsermanageComponent
  },
  {
    path: 'test',
    component: TestmanageComponent
  },
  {
    path: 'flowchart',
    component: FlowchartComponent
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

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DiagnosisComponent,
    QuestionnaireComponent,
    ReportComponent,
    QuestionboxComponent,
    ContactComponent,
    UsermanageComponent,
    TestmanageComponent,
    FlowchartComponent,
    SmalltableComponent
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
    ScrollEventModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }),
    RouterModule.forRoot(appRoutes)
  ],
  entryComponents: [
    SmalltableComponent
  ],
  providers: [TaskService, User, GlobalLanguageEventService],
  bootstrap: [AppComponent]
})
export class AppModule { }
