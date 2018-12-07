import {Component, ElementRef, OnInit, Renderer, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {User} from '../models/user';
import {TaskService} from '../service/taskService';
import {LocalDataSource} from 'ng2-smart-table';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {TranslateService} from 'ng2-translate';

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
  source: LocalDataSource;
  public modalRef: BsModalRef;
  testName: string;
  testComment: string;
  detailSource: LocalDataSource;
  questionCount: number;
  @ViewChild('detailTemplate') detailTemplate: TemplateRef<any>;

  constructor(public user: User, private taskService: TaskService,
              private modalService: BsModalService,
              private router: Router,
              private translate: TranslateService) {
    this.testName = '';
    this.testComment = '';
    this.questionCount = 0;
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
          title: '<i class="fa fa-1x fa-eye" aria-hidden="true"></i><i>       </i>',
        }
      ]
    },
    edit: {
      position: 'right',
      editButtonContent: '<i class="fa fa-1x fa-pencil-square" aria-hidden="true"></i><i>       </i>',
      saveButtonContent: '<i class="fa fa-1x fa-check"></i><i>       </i>',
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
    actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: true
  };

  ngOnInit() {
    this.taskService.getAllTest().subscribe( res => {
      // @ts-ignore
      const testJson = JSON.parse(res._body);
      // @ts-ignore
      this.tableData = [];
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
    });

  }

  onCustom(event) {
    this.detailSource = new LocalDataSource(event.data.detail);
    console.log(this.detailSource);
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
              Swal(
                this.translate.instant('删除成功'),
                '',
                'success'
              );
              event.confirm.resolve();
            }
          },
          error => {
              Swal(
                this.translate.instant('删除失败'),
                '',
                'error'
              );
              event.confirm.reject();
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          this.translate.instant('canceled'),
          '',
          'error'
        );
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
              Swal(
                this.translate.instant('updateSuccess'),
                '',
                'success'
              );
              event.confirm.resolve();
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
        Swal(
          this.translate.instant('canceled'),
          '',
          'error'
        );
      }
    });
  }

  openCreateModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-model'});
  }

  openDetailModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-model'});
  }

  createNewTest() {
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
        Swal(
          this.translate.instant('createFail'),
          '',
          'error'
        );
      }
    });
  }

}
