import { Injectable } from '@angular/core';
import {Http, Headers, ResponseContentType} from '@angular/http';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {TranslateService} from 'ng2-translate';
@Injectable()
export class TaskService {
    TASK_URL = 'http://10.177.241.51:10000/service/';
    constructor(public http: Http, private router: Router, private translate: TranslateService) { }

    createAuthorizationHeader(headers: Headers) {
      headers.append('Authorization', 'Bearer ' +
        localStorage.getItem('access_token'));
      headers.append('X-Requested-With', 'XMLHttpRequest');
    }

    login(username, password) {
      this.http.post(this.TASK_URL + 'login',
        { username: username, password: password }
        ).subscribe( res => {
          console.log(res);
          if (res.headers.get('x-access-token') !== null) {
            localStorage.setItem('access_token', res.headers.get('x-access-token'));
            localStorage.setItem('user_name', username);
            this.getUserByName(username).subscribe( data => {
              // @ts-ignore
              const userList = JSON.parse(data._body);
              const userId = userList._embedded.users[0].user.userId;
              const userRole = userList._embedded.users[0].user.roles[0].roleId;
              localStorage.setItem('user_id', userId);
              localStorage.setItem('user_role', userRole);
              console.log(localStorage);
              this.router.navigate(['/home']);
            });
          } else {
            Swal(
              this.translate.instant('loginFail'),
              this.translate.instant('passWordIncorrect'),
              'error'
            );
          }

      },
      error => {
        Swal(
          this.translate.instant('loginFail'),
          this.translate.instant('passWordIncorrect'),
          'error'
        );
      });
      return 0;
    }

    logOut() {
      localStorage.removeItem('access_token');
      return this.http.get(this.TASK_URL + 'logout');
    }

    getUserByName(name) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/users' + '?search=' + 'username==' + name,  {
        headers: headers
      });
    }

    getAllTest() {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/tests',  {
        headers: headers
      });
    }

    getTestByName(name) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/tests' + '?search=' + 'name==' + name,  {
        headers: headers
      });
    }

    getTestById(id) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/tests' + '?search=' + 'testId==' + id,  {
        headers: headers
      });
    }

    getAllQuestions(containStr) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      let locale = 'zh_CN'
      if (localStorage.getItem('language') === 'en') {
        locale = 'en_US';
      }
      return this.http.get(this.TASK_URL + 'api/questions?size=10000&search=locale==' + locale + ';detail=co="' + containStr + '"',  {
        headers: headers
      });
    }

    getCurrentUser(userName) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/users' + '?search=' + 'username==' + userName,  {
        headers: headers
      });
    }

    deleteQuestion(questionId) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.delete(this.TASK_URL + 'api/questions/' + questionId, {
        headers: headers
      });
    }

    deleteQuestionInTest(testId, questionId) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.delete(this.TASK_URL + 'api/tests/' + testId + '/questions', {
        headers: headers,
        body: [questionId]
      });
    }

    batchDeleteQuestion(ids) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.delete(this.TASK_URL + 'api/questions', {
        headers: headers,
        body: ids
      });
    }

    updateQuestion(questionObj) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.put(this.TASK_URL + 'api/questions', questionObj, {
        headers: headers
      });
    }

    commitAnswer(answerObj) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.put(this.TASK_URL + 'api/results',  answerObj, {
        headers: headers
      });
    }

    createTest(testObj) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.put(this.TASK_URL + 'api/tests', testObj, {
        headers: headers
      });
    }

    getAllResult(userName) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/results' + '?search=' + 'username==' + userName,  {
        headers: headers
      });
    }

    getResultById(resultId, tagId1, tagId3) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/results/' + resultId + '/' + tagId1 + '/' + tagId3 + '/' + '/summary',  {
        headers: headers
      });
    }

    reportToPdf(htmlString) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.post(this.TASK_URL + 'api/exporter/pdf', htmlString,  {
        headers: headers,
        responseType: ResponseContentType.Blob
      });
    }

    deleteTest(testId) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.delete(this.TASK_URL + 'api/tests/' + testId, {
        headers: headers
      });
    }

    updateTest(testObj) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.put(this.TASK_URL + 'api/tests', testObj, {
        headers: headers
      });
    }

    getAllUser() {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/users',  {
        headers: headers
      });
    }

    queryUsers(query) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/users?size=10000&search=username=co=' + query,  {
        headers: headers
      });
    }

    createUser(userObj) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.put(this.TASK_URL + 'api/users', userObj, {
        headers: headers
      });
    }
    deleteUser(userId) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.delete(this.TASK_URL + 'api/users/' + userId, {
        headers: headers
      });
    }

    updateUser(userObj) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.put(this.TASK_URL + 'api/users', userObj, {
        headers: headers
      });
    }

    registerUser(userObj) {
      return this.http.post(this.TASK_URL + 'api/users/signup', userObj, {
      });
    }

    verifyActiveCode(code, testId) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.post(this.TASK_URL + 'api/licenses/validate' +
        '?moduleType=TEST&testId=' + testId, code,
        {
        headers: headers
      });
    }

    generateActiveCode(param) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.post(this.TASK_URL + 'api/licenses/generate', param,  {
        headers: headers
      });
    }

    getTagResult(resultId, tagId) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/results/' + resultId + '/' + tagId + '/summary',  {
        headers: headers
      });
    }
}
