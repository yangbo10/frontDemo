import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {User} from '../models/user';
import {LocalDataSource} from 'ng2-smart-table';
import {TaskService} from '../service/taskService';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {TranslateService} from 'ng2-translate';
import {toNumber} from '../../../node_modules/ngx-bootstrap/timepicker/timepicker.utils';

@Component({
  selector: 'app-usermanage',
  templateUrl: './usermanage.component.html',
  styleUrls: ['./usermanage.component.css']
})
export class UsermanageComponent implements OnInit {

  userList: [any];
  tableData: [any];
  tableData2: [any];
  testList: [any];
  source: LocalDataSource;
  newUser: User = new User();
  selectTestId: number;
  selectUserId: number;
  currentCode: string;
  public modalRef: BsModalRef;
  public roleList = [
    {'roleId': 1, 'roleName': 'ADMIN'},
    {'roleId': 2, 'roleName': 'MANAGER'},
    {'roleId': 3, 'roleName': 'USER'}
  ];
  public param = {
    'modules': [
      {
        'type': 'TEST'
      }
    ],
    'testIds': [
      0
    ],
    'userIds': [
      0
    ]
  };
  @ViewChild('assignTemplate') assignTemplate: TemplateRef<any>;
  @ViewChild('mainTable') mainTable: TemplateRef<any>;

  constructor(public user: User, private taskService: TaskService,
              private modalService: BsModalService,
              private translate: TranslateService) {
    this.selectTestId = 0;
    this.selectUserId = 0;
    this.currentCode = '';
    this.user.mainShowing = false;
    // @ts-ignore
    this.tableData = [];
    this.source = new LocalDataSource(this.tableData);
  }

  public settings = {
    columns: {
      name: {
        title: this.translate.instant('userName'),
        filter: false,
        editable: false
      },
      roles: {
        title: this.translate.instant('role'),
        filter: false,
        editor: {
          type: 'list',
          config: {
            list: [
              { value: 'ADMIN', title: 'ADMIN' },
              { value: 'MANAGER', title: 'MANAGER' },
              { value: 'USER', title: 'USER' }
            ]
          }
        }
      },
      comment: {
        title: this.translate.instant('userDetail'),
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
          name: 'assign',
          title: '<i class="fa fa-1x fa-legal" aria-hidden="true"></i><i>       </i>',
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
    defaultStyle: true,
    noDataMessage: this.translate.instant('noDataMessage')
  };

  ngOnInit() {
    // @ts-ignore
    this.tableData = [];
    this.source = new LocalDataSource(this.tableData);
    this.taskService.getAllUser().subscribe( res => {
      // @ts-ignore
      const userJson = JSON.parse(res._body);
      if (userJson.hasOwnProperty('_embedded')) {
        this.userList = userJson._embedded.users;
        for ( let i = 0; i < this.userList.length; i++) {
          const item = {'id': '', 'name': '', 'comment': '', 'roles': ''};
          item.id = this.userList[i].user.userId;
          item.name = this.userList[i].user.username;
          item.comment = this.userList[i].user.comment;
          if (this.userList[i].user.roles.length > 0) {
            item.roles = this.userList[i].user.roles[0].name;
          }
          this.tableData.push(item);
        }
      }
      this.source = new LocalDataSource(this.tableData);
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
    if (query === '') {
      this.source = new LocalDataSource(this.tableData);
    } else {
      this.taskService.queryUsers(query).subscribe(data => {
        // @ts-ignore
        const userJson = JSON.parse(data._body);
        // @ts-ignore
        this.tableData2 = [];
        if (userJson.hasOwnProperty('_embedded')) {
          this.userList = userJson._embedded.users;
          console.log(this.userList);
          for ( let i = 0; i < this.userList.length; i++) {
            const item = {'id': '', 'name': '', 'comment': '', 'roles': ''};
            item.id = this.userList[i].user.userId;
            item.name = this.userList[i].user.username;
            item.comment = this.userList[i].user.comment;
            if (this.userList[i].user.roles.length > 0) {
              item.roles = this.userList[i].user.roles[0].name;
            }
            this.tableData2.push(item);
          }
        }
        this.source = new LocalDataSource(this.tableData2);
      });
    }
  }

  selectedTestChanged(event) {
    this.param.testIds[0] = this.selectTestId;
  }

  onCustom(event) {
    this.selectUserId = event.data.id;
    this.openAssignModal(this.assignTemplate);
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
        this.taskService.deleteUser(event.data.id).subscribe(res => {
            console.log(res);
            if (res.status  >= 200) {
              Swal(
                this.translate.instant('deleteSuccess'),
                '',
                'success'
              );
              event.confirm.resolve();
            }
          },
          error => {
              Swal(
                this.translate.instant('deleteFail'),
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


  getRoleIdByName(roleName) {
    const roleIdSet = [];
    for (let i = 0; i < this.roleList.length; i++) {
      if (this.roleList[i].roleName === roleName) {
        for (let j = i; j < this.roleList.length; j++) {
          roleIdSet.push({'roleId': this.roleList[j].roleId});
        }
        return roleIdSet;
      }
    }
  }
  onSaveConfirm(event) {
    const userObj = {
      'userId': event.newData.id,
      'username': event.newData.name,
      'comment': event.newData.comment,
      'roles': this.getRoleIdByName(event.newData.roles)
    };
    Swal({
      title: this.translate.instant('updateConfirm'),
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('sure'),
      cancelButtonText: this.translate.instant('cancel')
    }).then((result) => {
      if (result.value) {
        this.taskService.updateUser(userObj).subscribe(res => {
            console.log(res);
            if (res.status  >= 200) {
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
    this.newUser = new User();
  }

  openAssignModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-model'});
    this.param.testIds[0] = this.selectTestId;
    this.param.userIds[0] = this.selectUserId;
  }

  createNewUser() {
    const maxRoleId = this.newUser.roles[0].roleId;
    for ( let i = 1; i <= maxRoleId; i++ ) {
      this.newUser.roles.push({'roleId': i});
    }
    console.log(this.newUser);
    Swal({
      title:  this.translate.instant('createConfirm'),
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('sure'),
      cancelButtonText: this.translate.instant('cancel')
    }).then((result) => {
      if (result.value) {
        this.taskService.createUser(this.newUser).subscribe(res => {
            console.log(res);
            if (res.status >= 200) {
              Swal(
                this.translate.instant('createSuccess'),
                '',
                'success'
              );
              this.modalRef.hide();
              this.ngOnInit();
            }
          },
          error => {
            Swal(
              this.translate.instant('createFail'),
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

  generateCode() {
    this.taskService.generateActiveCode(this.param).subscribe( res => {
      // @ts-ignore
      const codeJson = JSON.parse(res._body);
      console.log(codeJson);
      if (codeJson.hasOwnProperty('license')) {
        // @ts-ignore
        this.currentCode = codeJson.license.licenceKey;
        Swal(
          this.translate.instant('createSuccess'),
          this.translate.instant('generateDetail') + this.currentCode,
          'success'
        );
        this.modalRef.hide();
      } else {
        Swal(
          this.translate.instant('generateFail'),
          '',
          'error'
        );
      }
    }, error => {
      Swal(
        this.translate.instant('generateFail'),
        '',
        'error'
      );
    });

  }

}
