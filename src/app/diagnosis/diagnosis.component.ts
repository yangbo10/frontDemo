import { Component, OnInit } from '@angular/core';
import {TaskService} from '../service/taskService';
import {Router} from '@angular/router';
import {User} from '../models/user';
import Swal from 'sweetalert2';
import {TranslateService} from 'ng2-translate';
import * as echarts from 'echarts';

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
  answerObj: any;
  resultDemo: any;
  diagnosisPhase: number;
  options1: object;
  options2: object;
  pieData1: [any];
  pieData2: [any];

  constructor(public user: User, private taskService: TaskService, private router: Router, private translate: TranslateService) {
    this.user.mainShowing = false;
    this.diagnosisPhase = 0;
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
        text: 'Result of Phase1',
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
        data: ['A', 'B', 'C', 'D', 'E']
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
        text: 'Result of Phase1',
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
        data: ['A', 'B', 'C', 'D', 'E']
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
    for (let i = 0; i < this.answerList.length; i ++) {
      if (this.answerList[i].question.questionId === val.question.questionId) {
        this.answerList[i] = val;
        this.reChoose = true;
      }
    }
    if ( this.reChoose === false) {
      this.answerList.push(val);
    }

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
    if (this.answerList.length === this.sourceList.length) {
      // @ts-ignore
      this.pieData1 = [
        {value: 335, name: 'A'},
        {value: 310, name: 'B'},
        {value: 234, name: 'C'},
        {value: 135, name: 'D'},
        {value: 1548, name: 'E'}
      ];
      this.options1 = {
        title : {
          text: 'Result of Phase1',
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
          data: ['A', 'B', 'C', 'D', 'E']
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
    if (this.answerList.length === this.sourceList.length + this.makeList.length) {
      // @ts-ignore
      this.pieData1 = [
        {value: 5, name: 'A'},
        {value: 13, name: 'B'},
        {value: 1, name: 'C'},
        {value: 2, name: 'D'},
        {value: 35, name: 'E'}
      ];
      this.options2 = {
        title : {
          text: 'Result of Phase1',
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
          data: ['A', 'B', 'C', 'D', 'E']
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

}
