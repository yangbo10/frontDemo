import { Injectable } from '@angular/core';
import {Http, Headers, ResponseContentType} from '@angular/http';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
@Injectable()
export class TaskService {
    TASK_URL = 'http://10.177.241.51:8000/service/';
    constructor(public http: Http, private router: Router) { }

    createAuthorizationHeader(headers: Headers) {
      headers.append('Authorization', 'Bearer ' +
        localStorage.getItem('access_token'));
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
              console.log(userId);
              localStorage.setItem('user_id', userId);
            });
            Swal(
              '登录成功',
              '',
              'success'
            );
             this.router.navigate(['/home']);
          } else {
            Swal(
              '登录失败',
              '用户名或密码错误',
              'error'
            );
          }

      },
      error => {
        Swal(
          '登录失败',
          '用户名或密码错误',
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

    getAllQuestions() {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/questions?size=10000&search=locale==zh_CN',  {
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

    getResultById(resultId) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/results/' + resultId + '/summary',  {
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
}
