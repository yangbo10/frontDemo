import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {TaskService} from '../service/taskService';
import {Router} from '@angular/router';
import {User} from '../models/user';
import Swal from 'sweetalert2';
import {TranslateService} from 'ng2-translate';
import 'rxjs/add/observable/fromEvent';
import { DOCUMENT } from '@angular/platform-browser';
import {toNumber} from '../../../node_modules/ngx-bootstrap/timepicker/timepicker.utils';

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
  sourceAnswerIdList: [any];
  makeAnswerIdList: [any];
  deliveryAnswerIdList: [any];
  answerObj: any;
  resultDemo: any;
  diagnosisPhase: number;
  options1: object;
  options2: object;
  options3: object;
  pieData1: [any];
  pieData2: [any];
  pieData3: [any];
  activeCodeCorrect: boolean;
  activeCode: string;
  selectedTestId: number;
  selectedTest: any;
  finalLevel: string;
  scrollHeight: number;
  finishAlertShowing: boolean;
  unFinishedQuestionHeight: number;
  findFirstUnFinish: boolean;
  lastSavedHeight: number;
  lastSavedId: number;
  phaseOneScore: string;
  phaseTwoScore: string;
  phaseThreeScore: string;
  answerStorage: any;
  currentUserId: string;
  gotHistory: boolean;

  constructor(@Inject(DOCUMENT) private document: Document,
              public user: User, private taskService: TaskService,
              private router: Router, private translate: TranslateService) {
    this.user.mainShowing = false;
    this.diagnosisPhase = 0;
    this.activeCodeCorrect = false;
    this.activeCode = '';
    this.selectedTestId = 0;
    this.finalLevel = '';
    this.finishAlertShowing = false;
    this.gotHistory = false;
    this.answerStorage = {
      'testId': 0,
      'currentPhase': 0,
      'answerList': [],
      'sourceAnswerList': [],
      'makeAnswerList': [],
      'deliveryAnswerList': [],
      'sourceAnswerIdList': [],
      'makeAnswerIdList': [],
      'deliveryAnswerIdList': [],
    };
  }
  // handle window scroll
  @HostListener('window:scroll', ['$event']) public windowScrolled($event: Event) {
    this.windowScrollEvent($event);
  }

  ngOnInit() {
    this.diagnosisPhase = 0;
    this.scrollHeight = 0;
    this.unFinishedQuestionHeight = 0;
    this.lastSavedHeight = 0;
    this.lastSavedId = 0;
    this.phaseOneScore = '';
    this.phaseTwoScore = '';
    this.phaseThreeScore = '';
    this.unsubmitable = false;
    this.questionShowing = true;
    this.findFirstUnFinish = false;
    this.currentUserId = localStorage.getItem('user_id');
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
    this.sourceAnswerIdList = [];
    // @ts-ignore
    this.makeAnswerIdList = [];
    // @ts-ignore
    this.deliveryAnswerIdList = [];
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
    // @ts-ignore
    this.pieData3 = [
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
          name: this.translate.instant('score'),
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data: this.pieData1,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          lableLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
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
          name: this.translate.instant('score'),
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data: this.pieData2,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          lableLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
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

    this.options3 = {
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
          name: this.translate.instant('score'),
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data: this.pieData3,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          lableLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
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

  protected windowScrollEvent($event: Event) {
    this.scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  startDiagnosis(test) {
    this.unFinishedQuestionHeight = 0;
    console.log(test);
    if (test.questions.length === 0 ) {
      // @ts-ignore
      Swal.fire({
        title: this.translate.instant('testZeroAlert'),
        type: 'error',
        showConfirmButton: true,
        timer: 3000
      });
    } else {
      this.selectedTest = test;
      this.diagnosisPhase++;
      // 答题历史纪录功能暂时关闭
      /*const storage = JSON.parse(localStorage.getItem('answerStorage_' + this.currentUserId));
      if (storage !== null) {
        if (toNumber(storage.testId) === test.testId) {
          console.log(storage);
          console.log('Got history');
          this.gotHistory = true;
          this.answerStorage = storage;
        }
      }*/
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
        case 1: this.sourceAnswerList.push(val);
          this.sourceAnswerIdList.push(val.question.questionIndex);
          if (this.sourceAnswerList.length === this.sourceList.length) {
            this.finishAlertShowing = false;
          }
          // calculate the first unfinished question position first time
          this.getFirstUnFinishedPosition(this.sourceAnswerIdList);
        break;
        case 3: this.makeAnswerList.push(val);
          this.makeAnswerIdList.push(val.question.questionIndex);
          if (this.makeAnswerList.length === this.makeList.length) {
            this.finishAlertShowing = false;
          }
          // calculate the first unfinished question position first time
          this.getFirstUnFinishedPosition(this.makeAnswerIdList);
          break;
        case 5: this.deliveryAnswerList.push(val);
          this.deliveryAnswerIdList.push(val.question.questionIndex);
          if (this.deliveryAnswerList.length === this.deliveryList.length) {
            this.finishAlertShowing = false;
          }
          // calculate the first unfinished question position first time
          this.getFirstUnFinishedPosition(this.deliveryAnswerIdList);
          break;
      }

    } else {
      switch (this.diagnosisPhase) {
        case 1: this.sourceAnswerList[index] = val; break;
        case 3: this.makeAnswerList[index - this.sourceAnswerList.length] = val; break;
        case 5: this.deliveryAnswerList[index - this.sourceAnswerList.length - this.makeAnswerList.length] = val; break;
      }
    }
    // 答题历史纪录功能暂时关闭
    /*this.answerStorage.testId = this.selectedTestId;
    this.answerStorage.answerList = this.answerList;
    this.answerStorage.sourceAnswerList = this.sourceAnswerList;
    this.answerStorage.makeAnswerList = this.makeAnswerList;
    this.answerStorage.deliveryAnswerList = this.deliveryAnswerList;
    this.answerStorage.sourceAnswerIdList = this.sourceAnswerIdList;
    this.answerStorage.makeAnswerIdList = this.makeAnswerIdList;
    this.answerStorage.deliveryAnswerIdList = this.deliveryAnswerIdList;
    this.answerStorage.currentPhase = this.diagnosisPhase;
    localStorage.setItem('answerStorage_' + this.currentUserId, JSON.stringify(this.answerStorage));*/
  }

  // sort method
  arraySort(arr) {
    for (let i = 1; i < arr.length; i ++) {
      const temp = arr[i];
      let j = i - 1;
      while (temp < arr[j]) {
        arr[j + 1] = arr[j];
        j--;
        if (j === -1) {
          break;
        }
      }
      arr[j + 1] = temp;
    }
  }

  // calculate the first unfinished question position
  getFirstUnFinishedPosition(answerList) {
    let i = 0;
    this.findFirstUnFinish = false;
    this.arraySort(answerList);
    // 挨个对比找到未答的第一道题
    for ( const item of answerList) {
      i ++;
      if (item !== i) {
        // get the first unFinished question position
        if (i === 1) {
          this.unFinishedQuestionHeight = 0;
        } else {
          this.unFinishedQuestionHeight = i * 298 - 145;
        }
        this.findFirstUnFinish = true;
        break;
      }
    }
    // 如果对比完没找到，那未完成的位置就是所答题目的最后一题后面一题的位置
    if (!this.findFirstUnFinish) {
      this.unFinishedQuestionHeight = (i + 1) * 298 - 145;
    }
    console.log('position:', this.unFinishedQuestionHeight);
    return;
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
            this.finalLevel = this.cacualateLevel(this.resultDemo.result.score);
            this.questionShowing = false;
            console.log(this.resultDemo);
            localStorage.setItem('overallScore', this.resultDemo.result.score);
            // 提交所有回答后清空localStorage 并 跳转到结果报告模块
            /*localStorage.setItem('answerStorage_' + this.currentUserId, null);*/
            this.router.navigate(['home/report']);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    } else {
      this.finishAlertShowing = true;
      this.findFirstUnFinish = false;
      window.scrollTo(0, this.unFinishedQuestionHeight);
    }
  }

  gotoNextPhase() {
    this.diagnosisPhase ++;
    window.scrollTo(0, 0);
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
      this.phaseOneScore = (sourceActual * 100 / sourceTotal).toFixed(2);
      // @ts-ignore
      this.pieData1 = [
        {value: sourceActual},
        {value: sourceTotal - sourceActual}
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
        series : [
          {
            name: 'Score',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data: this.pieData1,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
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
      /*this.answerStorage.currentPhase = this.diagnosisPhase + 1;
      localStorage.setItem('answerStorage_' + this.currentUserId, JSON.stringify(this.answerStorage));*/
    } else {
      this.finishAlertShowing = true;
      this.findFirstUnFinish = false;
      window.scrollTo(0, this.unFinishedQuestionHeight);
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
      this.phaseTwoScore = (makeActual * 100 / makeTotal).toFixed(2);
      // @ts-ignore
      this.pieData2 = [
        {value: makeActual},
        {value: makeTotal - makeActual}
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
        series : [
          {
            name: 'Score',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data: this.pieData2,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
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
      /*this.answerStorage.currentPhase = this.diagnosisPhase + 1;
      localStorage.setItem('answerStorage_' + this.currentUserId, JSON.stringify(this.answerStorage));*/
    } else {
      this.finishAlertShowing = true;
      this.findFirstUnFinish = false;
      window.scrollTo(0, this.unFinishedQuestionHeight);
    }
  }

  getPhaseThreeResult() {
    if (this.deliveryAnswerList.length === this.deliveryList.length) {
      // calculate score
      let deliveryTotal = 0;
      let deliveryActual = 0;
      for (const item of this.makeAnswerList) {
        deliveryTotal = deliveryTotal + item.point.totalScore;
        deliveryActual = deliveryActual + item.point.score;
      }
      this.phaseThreeScore = (deliveryActual * 100 / deliveryTotal).toFixed(2);
      // @ts-ignore
      this.pieData3 = [
        {value: deliveryActual},
        {value: deliveryTotal - deliveryActual}
      ];
      this.options3 = {
        title : {
          text: '',
          subtext: '',
          x: 'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series : [
          {
            name: 'Score',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data: this.pieData3,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
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
      // 在第三阶段阶段结果页面退出重连会清空本地存储
      localStorage.setItem('answerStorage_' + this.currentUserId, null);
    } else {
      this.finishAlertShowing = true;
      this.findFirstUnFinish = false;
      window.scrollTo(0, this.unFinishedQuestionHeight);
    }
  }

  gotoResultDetail() {
    this.router.navigate(['home/report']);
  }

  verifyCode() {
    this.selectedTestId = this.selectedTest.testId;
    this.taskService.verifyActiveCode(this.activeCode, this.selectedTestId ).subscribe( res => {
      this.questionList = this.selectedTest.questions;
      for ( const item of this.questionList) {
        if (item.tags[1].tagId === 'ad09f93d-e20c-4266-a524-0737040b709b') {
          this.sourceList.push(item);
        } else if (item.tags[1].tagId === 'a23c5813-8a42-46f8-8f04-4cdd125fe048') {
          this.makeList.push(item);
        } else {
          this.deliveryList.push(item);
        }
      }
      // @ts-ignore
      Swal.fire({
        title: this.translate.instant('verifySuccess'),
        type: 'success',
        showConfirmButton: true,
        timer: 3000
      });
      this.activeCodeCorrect = true;
      // -----------  present history here ------------
      /*if (this.gotHistory) {
        this.diagnosisPhase = this.answerStorage.currentPhase;
        this.answerList = this.answerStorage.answerList;
        this.sourceAnswerList = this.answerStorage.sourceAnswerList;
        this.makeAnswerList = this.answerStorage.makeAnswerList;
        this.deliveryAnswerList = this.answerStorage.deliveryAnswerList;
        this.sourceAnswerIdList = this.answerStorage.sourceAnswerIdList;
        this.makeAnswerIdList = this.answerStorage.makeAnswerIdList;
        this.deliveryAnswerIdList = this.answerStorage.deliveryAnswerIdList;
        switch (this.diagnosisPhase) {
          case 1: console.log('1');
             break;
          case 3: console.log('3');
            break;
          case 5: console.log('5');
            break;
        }
      }*/
    }, error => {
      // @ts-ignore
      Swal.fire({
        title: this.translate.instant('verifyFail'),
        type: 'error',
        showConfirmButton: true,
        timer: 3000
      });
    });

  }

  cacualateLevel(score) {
    const levelList = ['Beginner', 'Intermediate', 'Experienced', 'Expert', 'Top Performer'];
    const level = ((score - 0.01) / 20).toString().substring(0, 1);
    if (score === 0) {
      return levelList[0];
    } else {
      return levelList[toNumber(level)];
    }
  }

  backToChoose() {
    this.diagnosisPhase = 0;
  }


}
