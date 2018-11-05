import {Component, OnInit, EventEmitter, TemplateRef} from '@angular/core';
import {TaskService} from '../service/taskService';
import {LocalDataSource} from 'ng2-smart-table';
import { UploadOutput, UploadInput, UploadFile, UploaderOptions } from 'ngx-uploader';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import Swal from 'sweetalert2';

import {User} from '../models/user';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  testDemo: any;
  questionList: [any];
  newQuestionList: [any];
  tableData: [any];
  newTableData: [any];
  source: LocalDataSource;
  newSource: LocalDataSource;
  deleteList: [any];
  options: UploaderOptions;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  uploadDone: boolean;
  questionnaireName: string;
  testList: [any];
  selectTestId: number;
  newTestOrNot: boolean;
  public modalRef: BsModalRef;
  resultMessage: string;

  constructor(public user: User, private taskService: TaskService, private modalService: BsModalService) {
    this.options = { concurrency: 1, maxUploads: 3 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>();
    this.uploadDone = false;
    this.selectTestId = 0;
    this.resultMessage = '';
    this.user.mainShowing = false;
  }

  public settings = {
    columns: {
      name: {
        title: '试题名称',
        filter: false,
      },
      detail: {
        title: '试题详情',
        filter: false,
      },
      tag1: {
        title: '标签1',
        filter: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              { value: 'Enabler', title: 'Enabler' },
              { value: 'Lean', title: 'Lean' },
              { value: 'I4.0', title: 'I4.0' },
            ],
          },
        },
      },
      tag2: {
        title: '标签2',
        filter: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              { value: 'Source', title: 'Source' }
            ],
          },
        },
      },
      tag3: {
        title: '标签3',
        filter: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              { value: 'Standardization', title: 'Standardization' },
              { value: 'Transparent Processes', title: 'Transparent Processes' },
              { value: 'Associate Involvement', title: 'Associate Involvement' },
              { value: 'Continuous Improvement', title: 'Continuous Improvement' },
              { value: 'Flexibility', title: 'Flexibility' },
              { value: 'Perfect Quality', title: 'Perfect Quality' },
              { value: 'Process Orientation', title: 'Process Orientation' },
              { value: 'Pull System', title: 'Pull System' },
              { value: 'Resource', title: 'Resource' },
              { value: 'Digitization', title: 'Digitization' },
              { value: 'Automation', title: 'Automation' }
            ],
          },
        },
      }
    },
    pager: {
      display: true,
      perPage: 45
    },

    isPaginationEnabled: true,
    isGlobalSearchActivated: true,
    // itemsByPage: 10,
    selectMode: 'multi',

    // mode: "external",
    mode: 'inline',
    actions: {
      columnTitle: '操作',
      add: false,
      position: 'right'
    },
    edit: {
      position: 'right',
      editButtonContent: '<i class="fa fa-1x fa-pencil-square" aria-hidden="true"></i><i>       </i>',
      saveButtonContent: '<i class="fa fa-1x fa-check"></i>',
      cancelButtonContent: '<i class="fa fa-1x fa-close"></i>',
      confirmSave: true
    },
    delete: {
      position: 'right',
      deleteButtonContent: '<i class="fa fa-1x fa-trash" aria-hidden="true"></i>',
      confirmDelete: true
    },
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: true
  };

  public newSettings = {
    columns: {
      name: {
        title: '试题名称',
        filter: false,
      },
      detail: {
        title: '试题详情',
        filter: false,
      }
    },
    pager: {
      display: true,
      perPage: 10
    },

    isPaginationEnabled: true,
    actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: true
  };

  ngOnInit() {
    // @ts-ignore
    this.deleteList = [];
    this.taskService.getAllQuestions().subscribe(data => {
      // @ts-ignore
      this.testDemo = JSON.parse(data._body);
      this.questionList = this.testDemo._embedded.questions;
      // @ts-ignore
      this.tableData = [];
      for ( let i = 0; i < this.questionList.length; i++) {
        const item = {'id': '', 'name': '', 'detail': '', 'tag1': '', 'tag2': '', 'tag3': ''};
        item.id = this.questionList[i].question.questionId;
        item.name = this.questionList[i].question.name;
        item.detail = this.questionList[i].question.detail;
        item.tag1 = this.questionList[i].question.tags[0].name;
        item.tag2 = this.questionList[i].question.tags[1].name;
        item.tag3 = this.questionList[i].question.tags[2].name;
        this.tableData.push(item);
      }
      this.source = new LocalDataSource(this.tableData);
    });
    this.taskService.getAllTest().subscribe( res => {
      // @ts-ignore
      this.testDemo = JSON.parse(res._body);
      // @ts-ignore
      this.testList = this.testDemo._embedded.tests;
      this.selectTestId = this.testList[0].test.testId;
    });

  }


  onSearch(query: string = '') {
    console.log(this.source);
    this.source.setFilter([
      // fields we want to inclue in the search
      {
        field: 'name',
        search: query,
      },
      {
        field: 'detail',
        search: query,
      },
      {
        field: 'tag1',
        search: query,
      },
      {
        field: 'tag2',
        search: query,
      },
      {
        field: 'tag3',
        search: query,
      }
    ], false);
  }

  onDeleteConfirm(event) {
    Swal({
      title: '确认删除？',
      text: '将会总题库中删除试题',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        this.taskService.deleteQuestion(event.data.id).subscribe(res => {
            console.log(res);
            if (res.status === 200) {
              Swal(
                '删除成功',
                '',
                'success'
              );
              event.confirm.resolve();
            }
          },
          error => {
            if (error.status === 409) {
              Swal(
                '删除失败',
                '',
                'error'
              );
              event.confirm.reject();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          '已取消',
          '',
          'error'
        );
      }
    });
  }

  batchDelete() {
    Swal({
      title: '确认删除？',
      text: '将会总题库中删除试题',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        if ( this.deleteList.length < 1 ) {
          Swal(
            '请选择试题',
            '',
            'error'
          );
        } else {
          this.taskService.batchDeleteQuestion( this.deleteList ).subscribe(res => {
              console.log(res);
              if (res.status === 200) {
                Swal(
                  '删除成功',
                  '',
                  'success'
                );
                this.ngOnInit();
              }
            },
            error => {
              if (error.status === 409) {
                Swal(
                  '删除失败',
                  '',
                  'error'
                );
              }
            });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          '已取消',
          '',
          'error'
        );
      }
    });
  }

  onSaveConfirm(event) {
    const questionObj = {'questionId': event.newData.id, 'name': event.newData.name, 'detail': event.newData.detail};
    Swal({
      title: '确认修改？',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        this.taskService.updateQuestion(questionObj).subscribe(res => {
            console.log(res);
            if (res.status === 200) {
              Swal(
                '修改成功',
                '',
                'success'
              );
              this.ngOnInit();
            }
          },
          error => {
            Swal(
              '修改失败',
              '',
              'error'
            );
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          '已取消',
          '',
          'error'
        );
      }
    });
  }

  rowSelectEvent(event) {
    console.log(event);
    // is multi select?
    if (event.data === null) {
      // is selected or not
      // @ts-ignore
      this.deleteList = [];
      if ( event.selected.length > 0) {
        for (let i = 0; i < event.selected.length; i++) {
          this.deleteList.push(event.selected[i].id);
        }
      }
    } else {
      // is selected or not
      if ( event.isSelected === true) {
          this.deleteList.push(event.data.id);
      } else {
        // @ts-ignore
        this.deleteList = [];
        for (let i = 0; i < event.selected.length; i++) {
          this.deleteList.push(event.selected[i].id);
        }
      }
    }
    console.log(this.deleteList);
  }

  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'done':
        // @ts-ignore
        this.newQuestionList = output.file.response;
        console.log(this.newQuestionList);
        // @ts-ignore
        this.newTableData = [];
        for ( let i = 0; i < this.newQuestionList.length; i++) {
          const item = {'name': '', 'detail': ''};
          item.name = this.newQuestionList[i].name;
          item.detail = this.newQuestionList[i].detail;
          this.newTableData.push(item);
        }
        this.newSource = new LocalDataSource(this.newTableData);
        this.uploadDone = true;
        this.ngOnInit();
        break;
    }
  }

  startUpload(): void {
    this.uploadDone = false;
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.taskService.TASK_URL + 'api/importer/questions' + '?locale=' + 'zh_CN',
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' +
        localStorage.getItem('access_token') }
    };

    this.uploadInput.emit(event);
  }

  openUpload() {
    console.log(this.files);
    this.files = [];
  }

  openCreateModal(template: TemplateRef<any>) {
    this.newTestOrNot = true;
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-model'});
  }

  selectedNameChanged($event) {
    console.log('test list:', $event);
  }

  createQuestionnaire() {
    const testObj = {'questions': [], 'testId': 0 };
    const newTestObj = {'name': '', 'questions': []};
    if (this.newTestOrNot) {
      for (const item of this.deleteList) {
        const questionObj = {'questionId': item};
        newTestObj.questions.push(questionObj);
      }
      newTestObj.name = this.questionnaireName;
      this.taskService.createTest(newTestObj).subscribe( res => {
        console.log(res);
        this.modalRef.hide();
        if (res.status === 200) {
          Swal(
            '创建成功',
            '',
            'success'
          );
        } else {
          Swal(
            '创建失败',
            '',
            'error'
          );
        }
      });
    } else {
      for (const item of this.deleteList) {
        const questionObj = {'questionId': item};
        testObj.questions.push(questionObj);
      }
      testObj.testId = this.selectTestId;
      this.taskService.createTest(testObj).subscribe( res => {
        console.log(res.status);
        this.modalRef.hide();
        if (res.status === 200) {
          Swal(
            '创建成功',
            '',
            'success'
          );
        } else {
          Swal(
            '创建失败',
            '',
            'error'
          );
        }
      });
    }
  }

  isExistCheck() {
    this.newTestOrNot = false;
  }

  isNewCheck() {
    this.newTestOrNot = true;
  }

}
