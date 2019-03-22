import {Component, ElementRef, EventEmitter, OnInit, Renderer, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {User} from '../models/user';
import {TaskService} from '../service/taskService';
import {LocalDataSource} from 'ng2-smart-table';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {TranslateService} from 'ng2-translate';
import {UploaderOptions, UploadFile, UploadInput, UploadOutput} from 'ngx-uploader';

const tr = document.createElement('tr');
const aUpdate  =  tr.querySelector('a.bg-color-blue');

@Component({
  selector: 'app-testmanage',
  templateUrl: './testmanage.component.html',
  styleUrls: ['./testmanage.component.css']
})
export class TestmanageComponent implements OnInit {
  testList: [any];
  tableData: [any];
  tableData2: [any];
  source: LocalDataSource;
  public modalRef: BsModalRef;
  testName: string;
  testComment: string;
  detailTestId: number;
  detailSource: LocalDataSource;
  questionCount: number;
  currentLength: number;
  uploadInput: EventEmitter<UploadInput>;
  uploadDone: boolean;
  files: UploadFile[];
  options: UploaderOptions;
  @ViewChild('detailTemplate') detailTemplate: TemplateRef<any>;
  @ViewChild('mainTable') mainTable: TemplateRef<any>;

  constructor(public user: User, private taskService: TaskService,
              private modalService: BsModalService,
              private router: Router,
              private translate: TranslateService) {
    this.testName = '';
    this.testComment = '';
    this.questionCount = 0;
    this.currentLength = 0;
    this.user.mainShowing = false;
    this.files = []; // local uploading files array
    // @ts-ignore
    this.tableData = [];
    this.source = new LocalDataSource(this.tableData);
    this.uploadInput = new EventEmitter<UploadInput>();
    this.uploadDone = false;
    this.options = { concurrency: 1, maxUploads: 3 };
  }

  public settings = {
    columns: {
      name: {
        title: this.translate.instant('testName'),
        filter: false,
      },
      comment: {
        title: this.translate.instant('testComment'),
        filter: false,
      }
    },
    pager: {
      display: true,
      perPage: 15
    },

    isPaginationEnabled: true,
    isGlobalSearchActivated: true,
    // itemsByPage: 10,
    selectMode: 'multi',

    // mode: "external",
    mode: 'inline',
    actions: {
      columnTitle: this.translate.instant('operation'),
      add: false,
      position: 'right',
      custom: [
        {
          name: 'view',
          title: '<i title="' + this.translate.instant('detailIcon') +
            '" class="fa fa-1x fa-eye" aria-hidden="true"></i><i>       </i>',
        }
      ]
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

  public detailSettings = {
    columns: {
      name: {
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

  ngOnInit() {
    // @ts-ignore
    this.tableData = [];
    this.source = new LocalDataSource(this.tableData);
    this.taskService.getAllTest().subscribe( res => {
      // @ts-ignore
      const testJson = JSON.parse(res._body);
      // check empty
      if (testJson.hasOwnProperty('_embedded')) {
        this.testList = testJson._embedded.tests;
        for ( let i = 0; i < this.testList.length; i++) {
          const item = {'id': '', 'name': '', 'comment': '', 'detail': []};
          item.id = this.testList[i].test.testId;
          item.name = this.testList[i].test.name;
          item.comment = this.testList[i].test.comment;
          item.detail = this.testList[i].test.questions;
          this.tableData.push(item);
        }
      } else {
        console.log('data empty!');
      }
      this.source = new LocalDataSource(this.tableData);
      this.currentLength = this.tableData.length;
    });

  }

  onSearch(query) {
    // @ts-ignore
    this.mainTable.isAllSelected = false;
    if (query === '') {
      this.source = new LocalDataSource(this.tableData);
      this.currentLength = this.tableData.length;
    } else {
      this.taskService.getTestByName(query).subscribe(data => {
        // @ts-ignore
        const testJson = JSON.parse(data._body);
        // @ts-ignore
        this.tableData2 = [];
        // check empty
        if (testJson.hasOwnProperty('_embedded')) {
          this.testList = testJson._embedded.tests;
          for (let i = 0; i < this.testList.length; i++) {
            const item = {'id': '', 'name': '', 'comment': '', 'detail': []};
            item.id = this.testList[i].test.testId;
            item.name = this.testList[i].test.name;
            item.comment = this.testList[i].test.comment;
            item.detail = this.testList[i].test.questions;
            this.tableData2.push(item);
          }
        } else {
          console.log('data empty!');
        }
        this.source = new LocalDataSource(this.tableData2);
        this.currentLength = this.tableData2.length;
      });
    }
  }

  onCustom(event) {
    this.detailTestId = event.data.id;
    this.detailSource = new LocalDataSource(event.data.detail);
    console.log(event);
    this.questionCount = event.data.detail.length;
    this.openDetailModal(this.detailTemplate);
  }

  onDeleteConfirm(event) {
    Swal({
      title: this.translate.instant('deleteConfirm'),
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('sure'),
      cancelButtonText: this.translate.instant('cancel')
    }).then((result) => {
      if (result.value) {
        this.taskService.deleteTest(event.data.id).subscribe(res => {
            if (res.status >= 200) {
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

  onSaveConfirm(event) {
    const testObj = {'testId': event.newData.id, 'name': event.newData.name, 'comment': event.newData.comment};
    Swal({
      title: this.translate.instant('updateConfirm'),
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('sure'),
      cancelButtonText: this.translate.instant('cancel')
    }).then((result) => {
      if (result.value) {
        this.taskService.updateTest(testObj).subscribe(res => {
            console.log(res);
            if (res.status >= 200) {
              // @ts-ignore
              Swal.fire({
                title: this.translate.instant('updateSuccess'),
                type: 'success',
                showConfirmButton: true,
                timer: 3000
              });
              event.confirm.resolve();
            }
          },
          error => {
            // @ts-ignore
            Swal.fire({
              title: this.translate.instant('updateFail'),
              type: 'error',
              showConfirmButton: true,
              timer: 3000
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  onDetailSave(event) {
    const questionObj = {
      'questionId': event.newData.questionId,
      'name': event.newData.name,
      'detail': event.newData.detail
    };
    Swal({
      title: this.translate.instant('detailUpdateAlert'),
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
              this.refreshModalTable();
              this.ngOnInit();
            }
          },
          error => {
            // @ts-ignore
            Swal.fire({
              title: this.translate.instant('updateFail'),
              type: 'error',
              showConfirmButton: true,
              timer: 3000
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  onDetailDelete(event) {
    console.log('id:', this.detailTestId);
    Swal({
      title: this.translate.instant('detailDeleteAlert'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('sure'),
      cancelButtonText: this.translate.instant('cancel')
    }).then((result) => {
      if (result.value) {
        this.taskService.deleteQuestionInTest(this.detailTestId, event.data.questionId).subscribe(res => {
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
        // @ts-ignore
        Swal.fire({
          title: this.translate.instant('canceled'),
          type: 'success',
          showConfirmButton: true,
          timer: 3000
        });
      }
    });
  }

  refreshModalTable() {
    // refresh modal table
    this.taskService.getTestById(this.detailTestId).subscribe(data => {
      // @ts-ignore
      const testJson = JSON.parse(data._body);
      // check empty
      if (testJson.hasOwnProperty('_embedded')) {
        const questionList = testJson._embedded.tests[0].test.questions;
        console.log(questionList);
        this.detailSource = new LocalDataSource(questionList);
      }
    });
  }

  openCreateModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-model'});
    this.testName = '';
    this.testComment = '';
  }

  openDetailModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-model'});
  }

  createNewTest() {
    if (this.testName.trim() !== '') {
      const newTestObj = {'name': this.testName, 'comment': this.testComment};
      this.taskService.createTest(newTestObj).subscribe( res => {
        this.modalRef.hide();
        if (res.status >= 200) {
          Swal({
            title: this.translate.instant('createAlertTitle'),
            text: this.translate.instant('createAlertDescribe'),
            type: 'success',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('yes'),
            cancelButtonText: this.translate.instant('no')
          }).then((result) => {
            if (result.value) {
              console.log('aaa');
              this.router.navigate(['home/questionnaire']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              this.ngOnInit();
            }
          });
        } else {
          // @ts-ignore
          Swal.fire({
            title: this.translate.instant('createFail'),
            type: 'error',
            showConfirmButton: true,
            timer: 3000
          });
        }
      });
    } else {
      // @ts-ignore
      Swal.fire({
        title: this.translate.instant('createFail'),
        message: this.translate.instant('testNameEmpty'),
        type: 'error',
        showConfirmButton: true,
        timer: 3000
      });
    }

  }

  openUpload() {
    this.uploadDone = false;
    this.files = [];
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
        this.uploadDone = true;
        break;
    }
  }

  startUpload(): void {
    this.uploadDone = false;
    const name = 'flowchart';
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.taskService.TASK_URL + 'api/templates' + '?name=' + name,
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' +
          localStorage.getItem('access_token'),
        'X-Requested-With': 'XMLHttpRequest'}
    };

    this.uploadInput.emit(event);
  }

}
