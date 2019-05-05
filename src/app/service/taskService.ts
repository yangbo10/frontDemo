import { Injectable } from '@angular/core';
import {Http, Headers, ResponseContentType} from '@angular/http';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {TranslateService} from 'ng2-translate';
@Injectable()
export class TaskService {
    TASK_URL = 'http://10.177.241.51:10000/service/';
    TAG_1 = '2f8db6e8-4533-411b-8c34-0a3c2cddd6f3';
    TAG_2 = '11c1b4b9-d066-4dcf-8449-89bc5610d8b1';
    TAG_3 = '803f897b-6ae2-4feb-93a8-d0fce67d805b';
    TAG_SOURCE = 'ad09f93d-e20c-4266-a524-0737040b709b';
    TAG_MAKE = 'a23c5813-8a42-46f8-8f04-4cdd125fe048';
    TAG_DELIVERY = '';

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
            this.getUserByName().subscribe( data => {
              // @ts-ignore
              const userList = JSON.parse(data._body);
              const userId = userList.user.userId;
              const userRole = this.findHighestRole(userList.user.roles);
              localStorage.setItem('user_id', userId);
              localStorage.setItem('user_role', userRole);
              console.log(localStorage);
              console.log(userList.user.roles);
              this.router.navigate(['/home']);
            });
          } else {
            // @ts-ignore
            Swal.fire({
              title: this.translate.instant('passWordIncorrect'),
              type: 'error',
              showConfirmButton: true,
              timer: 3000
            });
          }

      },
      error => {
        // @ts-ignore
        Swal.fire({
          title: this.translate.instant('passWordIncorrect'),
          type: 'error',
          showConfirmButton: true,
          timer: 3000
        });
      });
      return 0;
    }

    findHighestRole(userRoleList) {
      const roleList = [
        'ADMIN',
        'MANAGER',
        'USER',
        'ACTUATOR'
      ];
      let index = roleList.length - 1;
      let temp;
      for (const item of userRoleList) {
        temp = roleList.indexOf(item.name);
        // 找出最小的数组下标
        if (temp < index) {
          index = temp;
        }
      }
      console.log('index:', index);
      return roleList[index];
    }

    logOut() {
      localStorage.removeItem('access_token');
      return this.http.get(this.TASK_URL + 'logout');
    }

    getUserByName() {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/users/me',  {
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

    getTestByName(query) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/tests?size=10000&search=name=co=' + query,  {
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

    getAllQuestions(containStr, language) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      let locale = 'zh_CN';
      if (language === 'en') {
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

    getAllResult(userName, userId) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/results' + '?search=' + 'createdBy==' + userId,  {
        headers: headers
      });
    }

    getResultById(resultId, tagId1, tagId3) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/results/' + resultId + '/' + tagId1 + '/' + tagId3 + '/summary',  {
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
      return this.http.get(this.TASK_URL + 'api/users?search=enabled==true',  {
        headers: headers
      });
    }

    queryUsers(query) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/users?size=10000&search=enabled==true;username=co=' + query,  {
        headers: headers
      });
    }

    createUser(userObj) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.post(this.TASK_URL + 'api/users', userObj, {
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

    createTemplate(param) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.post(this.TASK_URL + 'api/templates', param, {
        headers: headers
      });
    }

    getTemplate() {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.get(this.TASK_URL + 'api/templates',  {
        headers: headers
      });
    }

    createProcess(param) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.post(this.TASK_URL + 'api/processes', param, {
        headers: headers
      });
    }

    saveTask(taskId, param) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.put(this.TASK_URL + 'api/tasks/' + taskId, param, {
        headers: headers
      });
    }

    completeTask(taskId, param) {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.post(this.TASK_URL + 'api/tasks/' + taskId, param, {
        headers: headers
      });
    }
}
