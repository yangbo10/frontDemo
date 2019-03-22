import {Component, OnInit, EventEmitter, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import {TaskService} from '../service/taskService';
import {LocalDataSource} from 'ng2-smart-table';
import { UploadOutput, UploadInput, UploadFile, UploaderOptions } from 'ngx-uploader';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import Swal from 'sweetalert2';

import {User} from '../models/user';
import {e} from '../../../node_modules/@angular/core/src/render3';
import {toNumber} from '../../../node_modules/ngx-bootstrap/timepicker/timepicker.utils';
import {Router} from '@angular/router';
import {TranslateService} from 'ng2-translate';

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
  tableData2: [any];
  newTableData: [any];
  source: LocalDataSource;
  newSource: LocalDataSource;
  deleteList: [any];
  options: UploaderOptions;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  uploadDone: boolean;
  testList: [any];
  selectTestId: number;
  newTestOrNot: boolean;
  public modalRef: BsModalRef;
  resultMessage: string;
  uploadButtonMsg: string;
  selectedQuestions: [any];
  questionCache: [any];
  nameCache: [any];
  dimensionList: [any];
  dimensionCheckList: [any];
  addBtnDisable: boolean;
  currentLength: number;
  @ViewChild('mainTable') mainTable: ElementRef;
  constructor(public user: User, private taskService: TaskService,
              private modalService: BsModalService,
              private translate: TranslateService) {
    this.options = { concurrency: 1, maxUploads: 3 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>();
    this.uploadDone = false;
    this.selectTestId = 0;
    this.currentLength = 0;
    this.resultMessage = '';
    this.user.mainShowing = false;
    this.uploadButtonMsg = this.translate.instant('startUpload');
    this.addBtnDisable = false;
    // @ts-ignore
    this.tableData = [];
    this.source = new LocalDataSource(this.tableData);
    // @ts-ignore
    this.tableData2 = [];
    // @ts-ignore
    this.newTableData = [];
    // @ts-ignore
    this.nameCache = [];
    // @ts-ignore
    this.questionCache = [];
  }

  public tagList = [
    { value: 1, title: 'Enabler' },
    { value: 2, title: 'Lean' },
    { value: 3, title: 'I4.0' },
    { value: 4, title: 'Source' },
    { value: 5, title: 'Make' },
    { value: 6, title: 'Delivery' },
    { value: 7, title: 'Standardization' },
    { value: 8, title: 'Perfect Quality' },
    { value: 9, title: 'Transparent Processes' },
    { value: 10, title: 'Flexibility' },
    { value: 11, title: 'Pull System' },
    { value: 12, title: 'Process Orientation' },
    { value: 13, title: 'Continuous Improvement' },
    { value: 14, title: 'Resource' },
    { value: 15, title: 'Digitization' },
    { value: 16, title: 'Automation' },
    { value: 17, title: 'Associate Involvement' },

  ];

  public settings = {
    columns: {
      id: {
        title: this.translate.instant('questionIndex'),
        filter: false,
      },
      name: {
        title: this.translate.instant('questionName'),
        filter: false,
      },
      detail: {
        title: this.translate.instant('questionDetail'),
        filter: false,
        width: '50%',
      },
      tag1: {
        title: this.translate.instant('tag1'),
        filter: {
          type: 'list',
          config: {
            selectText: this.translate.instant('selectText'),
            list: [
              { value: 'Enabler', title: 'Enabler' },
              { value: 'Lean', title: 'Lean' },
              { value: 'I4.0', title: 'I4.0' },
            ],
          },
        },
        editor: {
          type: 'list',
          config: {
            list: [
              { value: 'Enabler', title: 'Enabler' },
              { value: 'Lean', title: 'Lean' },
              { value: 'I4.0', title: 'I4.0' }]
          }
        }
      },
      tag2: {
        title: this.translate.instant('tag2'),
        filter: {
          type: 'list',
          config: {
            selectText: this.translate.instant('selectText'),
            list: [
              { value: 'Source', title: 'Source' },
              { value: 'Make', title: 'Make' },
              { value: 'Delivery', title: 'Delivery' }
            ],
          },
        },
        editor: {
          type: 'list',
          config: {
            list: [
              { value: 'Source', title: 'Source' },
              { value: 'Make', title: 'Make' },
              { value: 'Delivery', title: 'Delivery' }
              ]
          }
        }
      },
      tag3: {
        title: this.translate.instant('tag3'),
        filter: {
          type: 'list',
          config: {
            selectText: this.translate.instant('selectText'),
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
        editor: {
          type: 'list',
          config: {
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
            ]
          }
        }
      }
    },
    pager: {
      display: true,
      perPage: 45
    },

    isPaginationEnabled: true,
    // itemsByPage: 10,
    selectMode: 'multi',

    // mode: "external",
    mode: 'inline',
    actions: {
      columnTitle: this.translate.instant('operation'),
      add: false,
      position: 'right'
    },
    edit: {
      position: 'right',
      editButtonContent: '<i title="' + this.translate.instant('editIcon') +
        '" class="fa fa-1x fa-pencil-square" aria-hidden="true"></i><i>       </i>',
      saveButtonContent: '<i title="' + this.translate.instant('saveIcon') +
        '" class="fa fa-1x fa-check"></i><i>       </i>',
      cancelButtonContent: '<i title="' + this.translate.instant('cancelIcon') +
        '" class="fa fa-1x fa-close"></i>',
      confirmSave: true
    },
    delete: {
      position: 'right',
      deleteButtonContent: '<i title="' + this.translate.instant('deleteIcon') +
        '" class="fa fa-1x fa-trash" aria-hidden="true"></i>',
      confirmDelete: true
    },
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: true,
    noDataMessage: this.translate.instant('noDataMessage')
  };

  public newSettings = {
    columns: {
      id: {
        title: this.translate.instant('questionName'),
        filter: false,
      },
      detail: {
        title: this.translate.instant('questionDetail'),
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
    defaultStyle: true,
    noDataMessage: this.translate.instant('noDataMessage')
  };

  ngOnInit() {
    // @ts-ignore
    this.deleteList = [];
    // @ts-ignore
    this.selectedQuestions = [];
    // @ts-ignore
    this.dimensionList = [];
    // @ts-ignore
    this.dimensionCheckList = [];
    this.addBtnDisable = false;
    // @ts-ignore
    this.tableData = [];
    this.source = new LocalDataSource(this.tableData);
    this.taskService.getAllQuestions('').subscribe(data => {
      // @ts-ignore
      this.testDemo = JSON.parse(data._body);

      if (this.testDemo.hasOwnProperty('_embedded')) {
        this.questionList = this.testDemo._embedded.questions;
        for ( let i = 0; i < this.questionList.length; i++) {
          const item = {'id': '', 'name': '', 'detail': '', 'tag1': '', 'tag2': '', 'tag3': '', 'dimensionId': 0};
          item.id = (i + 1).toString();
          item.name = this.questionList[i].question.name;
          item.detail = this.questionList[i].question.detail;
          if (this.questionList[i].question.tags.length > 0) {
            item.tag1 = this.questionList[i].question.tags[0].name;
          }
          if (this.questionList[i].question.tags.length > 1) {
            item.tag2 = this.questionList[i].question.tags[1].name;
          }
          if (this.questionList[i].question.tags.length > 2) {
            item.tag3 = this.questionList[i].question.tags[2].name;
            item.dimensionId = this.questionList[i].question.tags[2].tagId;
          }
          this.tableData.push(item);
        }
      } else {
        console.log('data empty!');
      }
      console.log(this.tableData);
      this.source = new LocalDataSource(this.tableData);
      this.currentLength = this.tableData.length;
    });
    this.taskService.getAllTest().subscribe( res => {
      // @ts-ignore
      const testJson = JSON.parse(res._body);
      if (testJson.hasOwnProperty('_embedded')) {
        // @ts-ignore
        this.testList = testJson._embedded.tests;
        this.selectTestId = this.testList[0].test.testId;
      } else {
        // @ts-ignore
        this.testList = [];
      }
    });

  }


  onSearch(query) {
    // @ts-ignore
    this.mainTable.isAllSelected = false;
    // @ts-ignore
    this.deleteList = [];
    // @ts-ignore
    this.selectedQuestions = [];
    if (query === '') {
      this.source = new LocalDataSource(this.tableData);
      this.currentLength = this.tableData.length;
    } else {
      this.taskService.getAllQuestions(query).subscribe(data => {
        // @ts-ignore
        this.testDemo = JSON.parse(data._body);
        // @ts-ignore
        this.tableData2 = [];
        if (this.testDemo.hasOwnProperty('_embedded')) {
          this.questionList = this.testDemo._embedded.questions;
          for ( let i = 0; i < this.questionList.length; i++) {
            const item = {'id': '', 'name': '', 'detail': '', 'tag1': '', 'tag2': '', 'tag3': '', 'dimensionId': 0};
            item.id = (i + 1).toString();
            item.name = this.questionList[i].question.name;
            item.detail = this.questionList[i].question.detail;
            if (this.questionList[i].question.tags.length > 0) {
              item.tag1 = this.questionList[i].question.tags[0].name;
            }
            if (this.questionList[i].question.tags.length > 1) {
              item.tag2 = this.questionList[i].question.tags[1].name;
            }
            if (this.questionList[i].question.tags.length > 2) {
              item.tag3 = this.questionList[i].question.tags[2].name;
              item.dimensionId = this.questionList[i].question.tags[2].id;
            }
            this.tableData2.push(item);
          }
        }
        this.source = new LocalDataSource(this.tableData2);
        this.currentLength = this.tableData2.length;
        console.log(this.source);
      });
    }
  }

  onDeleteConfirm(event) {
    Swal({
      title: this.translate.instant('deleteConfirm'),
      text: this.translate.instant('deleteDescribe'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('sure'),
      cancelButtonText: this.translate.instant('cancel')
    }).then((result) => {
      if (result.value) {
        this.taskService.deleteQuestion(event.data.id).subscribe(res => {
            console.log(res);
            if (res.status  >= 200) {
              // @ts-ignore
              Swal.fire({
                title: this.translate.instant('deleteSuccess'),
                type: 'success',
                showConfirmButton: true,
                timer: 3000
              });
              event.confirm.resolve();
              this.ngOnInit();
            }
          },
          error => {
              // @ts-ignore
              Swal.fire({
                title: this.translate.instant('deleteFail'),
                type: 'error',
                showConfirmButton: true,
                timer: 3000
              });
              event.confirm.reject();
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  batchDelete() {
    Swal({
      title: this.translate.instant('deleteConfirm'),
      text: this.translate.instant('deleteDescribe'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('sure'),
      cancelButtonText: this.translate.instant('cancel')
    }).then((result) => {
      if (result.value) {
        if ( this.deleteList.length < 1 ) {
          // @ts-ignore
          Swal.fire({
            title: this.translate.instant('selectAlert'),
            type: 'error',
            showConfirmButton: true,
            timer: 3000
          });
        } else {
          this.taskService.batchDeleteQuestion( this.deleteList ).subscribe(res => {
              console.log(res);
              if (res.status  >= 200) {
                // @ts-ignore
                Swal.fire({
                  title: this.translate.instant('deleteSuccess'),
                  type: 'success',
                  showConfirmButton: true,
                  timer: 3000
                });
                this.ngOnInit();
              }
            },
            error => {
              if (error.status === 409) {
                // @ts-ignore
                Swal.fire({
                  title: this.translate.instant('deleteFail'),
                  type: 'error',
                  showConfirmButton: true,
                  timer: 3000
                });
              }
            });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  getTagIdByName(tagName) {
    for (const item of this.tagList) {
      if (item.title === tagName) {
        return item.value;
      }
    }
  }

  onSaveConfirm(event) {
    console.log(event);
    const questionObj = {
      'questionId': event.newData.id,
      'name': event.newData.name,
      'detail': event.newData.detail,
      'tags': [
        {
          'tagId': this.getTagIdByName(event.newData.tag1)
        },
        {
          'tagId': this.getTagIdByName(event.newData.tag2)
        },
        {
          'tagId': this.getTagIdByName(event.newData.tag3)
        }
      ]};
    if (event.newData.tag1 === event.data.tag1 &&
      event.newData.tag2 === event.data.tag2 &&
      event.newData.tag3 === event.data.tag3) {
      questionObj.tags = null;
    }
    Swal({
      title: this.translate.instant('updateConfirm'),
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('sure'),
      cancelButtonText: this.translate.instant('cancel')
    }).then((result) => {
      if (result.value) {
        this.taskService.updateQuestion(questionObj).subscribe(res => {
            console.log(res);
            if (res.status  >= 200) {
              // @ts-ignore
              Swal.fire({
                title: this.translate.instant('updateSuccess'),
                type: 'success',
                showConfirmButton: true,
                timer: 3000
              });
              this.ngOnInit();
            }
          },
          error => {
            Swal(
              this.translate.instant('updateFail'),
              '',
              'error'
            );
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
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
      // @ts-ignore
      this.selectedQuestions = [];
      // @ts-ignore
      this.dimensionList = [];
      if ( event.selected.length > 0) {
        for (let i = 0; i < event.selected.length; i++) {
          this.deleteList.push(event.selected[i].id);
          this.selectedQuestions.push(event.selected[i].name);
          this.dimensionList.push(event.selected[i].dimensionId);
        }
      }
    } else {
      // is selected or not
      if ( event.isSelected === true) {
          this.deleteList.push(event.data.id);
          this.selectedQuestions.push(event.data.name);
          this.dimensionList.push(event.data.dimensionId);
      } else {
        // @ts-ignore
        this.deleteList = [];
        // @ts-ignore
        this.selectedQuestions = [];
        // @ts-ignore
        this.dimensionList = [];
        for (let i = 0; i < event.selected.length; i++) {
          this.deleteList.push(event.selected[i].id);
          this.selectedQuestions.push(event.selected[i].name);
          this.dimensionList.push(event.selected[i].dimensionId);
        }
      }
    }
  }

  addToCache() {
    this.addBtnDisable = true;
    let duplicate = false;
    for (const item of this.deleteList) {
      // check duplicate
      if (this.questionCache.indexOf(item) > -1) {
        duplicate = true;
      }
    }
    if (!duplicate) {
      for (const item of this.deleteList) {
        this.questionCache.push(item);
      }
      for (const item of this.selectedQuestions) {
        this.nameCache.push(item);
      }
      for (const item of this.dimensionList) {
        this.dimensionCheckList.push(item);
      }
    } else {
      // @ts-ignore
      Swal.fire({
        title: this.translate.instant('itemDuplicate'),
        type: 'error',
        showConfirmButton: true,
        timer: 3000
      });
    }
    console.log('check dimension: ', this.dimensionCheckList);
  }

  clearCache() {
    // @ts-ignore
    this.questionCache = [];
    // @ts-ignore
    this.nameCache = [];
    this.addBtnDisable = false;
    // @ts-ignore
    this.dimensionCheckList = [];
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
        this.uploadButtonMsg = this.translate.instant('continueUpload');
        break;
    }
  }

  startUpload(): void {
    this.uploadDone = false;
    let locale = 'zh_CN';
    if (localStorage.getItem('language') === 'en') {
      locale = 'en_US';
    }
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.taskService.TASK_URL + 'api/importer/questions' + '?locale=' + locale,
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' +
        localStorage.getItem('access_token'),
        'X-Requested-With': 'XMLHttpRequest'}
    };

    this.uploadInput.emit(event);
  }

  openUpload() {
    this.uploadButtonMsg = this.translate.instant('startUpload');
    this.uploadDone = false;
  }

  openCreateModal(template: TemplateRef<any>) {
    this.addBtnDisable = false;
    this.newTestOrNot = true;
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-model'});
  }

  selectedNameChanged($event) {
    console.log('test list:', $event);
  }

  createQuestionnaire() {
    const testObj = {'questions': [], 'testId': 0 };
    for (const item of this.questionCache) {
      const questionObj = {'questionId': item};
      testObj.questions.push(questionObj);
    }
    testObj.testId = this.selectTestId;
    this.taskService.createTest(testObj).subscribe( res => {
      console.log(res.status);
      this.modalRef.hide();
      if (res.status >= 200) {
        // @ts-ignore
        Swal.fire({
          title: this.translate.instant('addSuccess'),
          type: 'success',
          showConfirmButton: true,
          timer: 3000
        });
      } else {
        // @ts-ignore
        Swal.fire({
          title: this.translate.instant('addFail'),
          type: 'error',
          showConfirmButton: true,
          timer: 3000
        });
      }
    }, error => {
      console.log(error);
      // @ts-ignore
      Swal.fire({
        title: this.translate.instant('addFail') + ', ' + this.translate.instant('addFailReason'),
        type: 'error',
        showConfirmButton: true,
        timer: 3000
      });
    });
  }

  changeBackground(tagId: number): any {
    if (this.dimensionCheckList.indexOf(tagId) >= 0) {
      return { 'background-color': '#5cb85c' };
    } else {
      return { 'background-color': 'gray' };
    }
  }

  closeAddModal() {
    this.modalRef.hide();
    // @ts-ignore
    this.mainTable.isAllSelected = false;
    // @ts-ignore
    this.selectedQuestions = [];
    // @ts-ignore
    this.deleteList = [];
    // @ts-ignore
    this.dimensionList = [];
    this.onSearch('');
  }
}
