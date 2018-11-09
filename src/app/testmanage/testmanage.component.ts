import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {User} from '../models/user';
import {TaskService} from '../service/taskService';
import {LocalDataSource} from 'ng2-smart-table';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

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

  constructor(public user: User, private taskService: TaskService, private modalService: BsModalService, private router: Router) {
    this.testName = '';
    this.testComment = '';
  }

  public settings = {
    columns: {
      name: {
        title: '试卷名称',
        filter: false,
      },
      comment: {
        title: '试卷详情',
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

  ngOnInit() {
    this.taskService.getAllTest().subscribe( res => {
      // @ts-ignore
      const testJson = JSON.parse(res._body);
      this.testList = testJson._embedded.tests;
      // @ts-ignore
      this.tableData = [];
      for ( let i = 0; i < this.testList.length; i++) {
        const item = {'id': '', 'name': '', 'comment': ''};
        item.id = this.testList[i].test.testId;
        item.name = this.testList[i].test.name;
        item.comment = this.testList[i].test.comment;
        this.tableData.push(item);
      }
      this.source = new LocalDataSource(this.tableData);
    });

  }

  onDeleteConfirm(event) {
    Swal({
      title: '确认删除？',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        this.taskService.deleteTest(event.data.id).subscribe(res => {
            if (res.status >= 200) {
              Swal(
                '删除成功',
                '',
                'success'
              );
              event.confirm.resolve();
            }
          },
          error => {
              Swal(
                '删除失败',
                '',
                'error'
              );
              event.confirm.reject();
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

  onSaveConfirm(event) {
    const testObj = {'testId': event.newData.id, 'name': event.newData.name, 'comment': event.newData.comment};
    Swal({
      title: '确认修改？',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        this.taskService.updateTest(testObj).subscribe(res => {
            console.log(res);
            if (res.status >= 200) {
              Swal(
                '修改成功',
                '',
                'success'
              );
              event.confirm.resolve();
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

  openCreateModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-model'});
  }

  createNewTest() {
    const newTestObj = {'name': this.testName, 'comment': this.testComment};
    this.taskService.createTest(newTestObj).subscribe( res => {
      this.modalRef.hide();
      if (res.status >= 200) {
        Swal({
          title: '创建成功，是否立即添加试题？',
          text: '将会跳转至题库管理',
          type: 'success',
          showCancelButton: true,
          confirmButtonText: '是',
          cancelButtonText: '否'
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
          '创建失败',
          '',
          'error'
        );
      }
    });
  }

}
