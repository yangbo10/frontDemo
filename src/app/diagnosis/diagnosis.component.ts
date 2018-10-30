import { Component, OnInit } from '@angular/core';
import {TaskService} from '../service/taskService';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import {User} from '../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {
  testDemo: any;
  questionList: [any];
  unsubmitable: boolean;
  reChoose: boolean;
  questionShowing: boolean;
  answerList: [any];
  answerObj: any;
  resultDemo: any;
  constructor(public user: User, private taskService: TaskService, private router: Router) {
    this.user.mainShowing = false;
  }

  ngOnInit() {
    this.unsubmitable = true;
    this.questionShowing = true;
    // @ts-ignore
    this.answerList = [];
    if (localStorage.getItem('access_token') === null) {
      this.router.navigate(['']);
    } else {
      this.taskService.getTestById(1).subscribe(data => {
        // @ts-ignore
        this.testDemo = JSON.parse(data._body);
        this.questionList = this.testDemo._embedded.tests[0].test.questions;
      });
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

    console.log(this.answerList);

    if (/*this.answerList.length === this.questionList.length*/1) {

      this.unsubmitable = false;
    }
  }

  sentAnswer() {
    if (this.answerList.length === this.questionList.length) {
      Swal({
        title: '确认提交？',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
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
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal(
            '已取消',
            '',
            'error'
          );
        }
      });
    } else {
      Swal(
        '请答完所有题目',
        '',
        'error'
      );
    }
  }

  gotoResultDetail() {
    this.router.navigate(['home/report']);
  }

}
