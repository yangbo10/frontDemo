import { Component, OnInit } from '@angular/core';
import {TaskService} from '../service/taskService';
import {Router} from '@angular/router';
import {User} from '../models/user';
import Swal from 'sweetalert2';
import {TranslateService} from 'ng2-translate';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {
  testDemo: any;
  testList: [any];
  questionList: [any];
  sourceList: [any];
  makeList: [any];
  deliveryList: [any];
  unsubmitable: boolean;
  reChoose: boolean;
  questionShowing: boolean;
  answerList: [any];
  sourceAnswerList: [any];
  makeAnswerList: [any];
  deliveryAnswerList: [any];
  answerObj: any;
  resultDemo: any;
  diagnosisPhase: number;
  options1: object;
  options2: object;
  pieData1: [any];
  pieData2: [any];
  activeCodeCorrect: boolean;
  activeCode: string;
  selectedTestId: number;

  constructor(public user: User, private taskService: TaskService, private router: Router, private translate: TranslateService) {
    this.user.mainShowing = false;
    this.diagnosisPhase = 0;
    this.activeCodeCorrect = false;
    this.activeCode = '';
    this.selectedTestId = 0;
  }

  ngOnInit() {
    this.diagnosisPhase = 0;
    this.unsubmitable = true;
    this.questionShowing = true;
    // @ts-ignore
    this.testList = [];
    // @ts-ignore
    this.answerList = [];
    // @ts-ignore
    this.sourceAnswerList = [];
    // @ts-ignore
    this.makeAnswerList = [];
    // @ts-ignore
    this.deliveryAnswerList = [];
    // @ts-ignore
    this.sourceList = [];
    // @ts-ignore
    this.makeList = [];
    // @ts-ignore
    this.deliveryList = [];
    // @ts-ignore
    this.pieData1 = [
    ];
    // @ts-ignore
    this.pieData2 = [
    ];
    if (localStorage.getItem('access_token') === null) {
      this.router.navigate(['']);
    } else {
      this.taskService.getAllTest().subscribe(data => {
        // @ts-ignore
        this.testDemo = JSON.parse(data._body);
        this.testList = this.testDemo._embedded.tests;
      });
    }

    this.options1 = {
      title : {
        text: '',
        subtext: '',
        x: 'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['A', 'B']
      },
      series : [
        {
          name: 'Score',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data: this.pieData1,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    this.options2 = {
      title : {
        text: '',
        subtext: '',
        x: 'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['A', 'B']
      },
      series : [
        {
          name: 'Score',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data: this.pieData2,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

  }

  startDiagnosis(test) {
    console.log(test);
    if (test.questions.length === 0 ) {
      Swal(
        this.translate.instant('testZeroAlert'),
        '',
        'error'
      );
    } else {
      this.selectedTestId = test.testId;
      this.questionList = test.questions;
      for ( const item of this.questionList) {
        if (item.tags[1].tagId === 4) {
          this.sourceList.push(item);
        } else if (item.tags[1].tagId === 5) {
          this.makeList.push(item);
        } else {
          this.deliveryList.push(item);
        }
      }
      this.diagnosisPhase++;
    }
  }

  getFromChild(val) {
    this.reChoose = false;
    let index = 0;
    for (let i = 0; i < this.answerList.length; i ++) {
      if (this.answerList[i].question.questionId === val.question.questionId) {
        this.answerList[i] = val;
        this.reChoose = true;
        // find index
        index = i;
        break;
      }
    }
    if ( this.reChoose === false) {
      this.answerList.push(val);
      switch (this.diagnosisPhase) {
        case 1: this.sourceAnswerList.push(val); break;
        case 3: this.makeAnswerList.push(val); break;
        case 5: this.deliveryAnswerList.push(val); break;
      }
    } else {
      switch (this.diagnosisPhase) {
        case 1: this.sourceAnswerList[index] = val; break;
        case 3: this.makeAnswerList[index - this.sourceAnswerList.length] = val; break;
        case 5: this.deliveryAnswerList[index - this.sourceAnswerList.length - this.makeAnswerList.length] = val; break;
      }
    }

    console.log(this.makeAnswerList);
    if (/*this.answerList.length === this.questionList.length*/1) {

      this.unsubmitable = false;
    }
  }

  sentAnswer() {
    if (this.answerList.length === this.questionList.length) {
      Swal({
        title: this.translate.instant('submitConfirm'),
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.translate.instant('sure'),
        cancelButtonText: this.translate.instant('cancel')
      }).then((result) => {
        if (result.value) {
          this.answerObj = {'name': '', 'test': '', 'user': '', 'choices': ''};
          this.answerObj.name = 'result of ' + this.testDemo._embedded.tests[0].test.name;
          this.answerObj.test = {'testId': this.testDemo._embedded.tests[0].test.testId};
          this.answerObj.user = {'userId': localStorage.getItem('user_id')};
          this.answerObj.choices = this.answerList;

          console.log('Commit to server.....please wait');
          console.log(JSON.stringify(this.answerObj));
          this.taskService.commitAnswer(this.answerObj).subscribe(data => {
            // @ts-ignore
            this.resultDemo = JSON.parse(data._body);
            this.questionShowing = false;
            console.log(this.resultDemo);
            localStorage.setItem('overallScore', this.resultDemo.result.score);
            this.diagnosisPhase++;
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal(
            this.translate.instant('canceled'),
            '',
            'error'
          );
        }
      });
    } else {
      Swal(
        this.translate.instant('finishAlert'),
        '',
        'error'
      );
    }
  }

  gotoNextPhase() {
    this.diagnosisPhase ++;
  }

  getPhaseOneResult() {
    if (this.sourceAnswerList.length === this.sourceList.length) {
      // calculate score
      let sourceTotal = 0;
      let sourceActual = 0;
      for (const item of this.sourceAnswerList) {
        sourceTotal = sourceTotal + item.point.totalScore;
        sourceActual = sourceActual + item.point.score;
      }
      // @ts-ignore
      this.pieData1 = [
        {value: sourceActual, name: 'scored'},
        {value: sourceTotal - sourceActual, name: 'not scored'}
      ];
      this.options1 = {
        title : {
          text: '',
          subtext: '',
          x: 'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['scored', 'unscored']
        },
        series : [
          {
            name: 'Score',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data: this.pieData1,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.diagnosisPhase++;
    } else {
      Swal(
        this.translate.instant('finishAlert'),
        '',
        'error'
      );
    }
  }

  getPhaseTwoResult() {
    if (this.makeAnswerList.length === this.makeList.length) {
      // calculate score
      let makeTotal = 0;
      let makeActual = 0;
      for (const item of this.makeAnswerList) {
        makeTotal = makeTotal + item.point.totalScore;
        makeActual = makeActual + item.point.score;
      }
      // @ts-ignore
      this.pieData2 = [
        {value: makeActual, name: 'A'},
        {value: makeTotal - makeActual, name: 'B'}
      ];
      this.options2 = {
        title : {
          text: '',
          subtext: '',
          x: 'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['A', 'B']
        },
        series : [
          {
            name: 'Score',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data: this.pieData2,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.diagnosisPhase++;
    } else {
      Swal(
        this.translate.instant('finishAlert'),
        '',
        'error'
      );
    }
  }

  gotoResultDetail() {
    this.router.navigate(['home/report']);
  }

  verifyCode() {
    this.taskService.verifyActiveCode(this.activeCode, this.selectedTestId ).subscribe( res => {
      /*Swal(
        this.translate.instant('verifySuccess'),
        '',
        'success'
      );*/
      this.activeCodeCorrect = true;
    }, error => {
      Swal(
        this.translate.instant('verifyFail'),
        '',
        'error'
      );
    });

  }

}
