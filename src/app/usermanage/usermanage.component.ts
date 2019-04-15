import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {User} from '../models/user';
import {LocalDataSource} from 'ng2-smart-table';
import {TaskService} from '../service/taskService';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {TranslateService} from 'ng2-translate';
import {toNumber} from '../../../node_modules/ngx-bootstrap/timepicker/timepicker.utils';
import {GlobalLanguageEventService} from '../service/global-language-event.service';

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
  currentLength: number;
  selectedRoleName: string;
  public settings: any;
  translateList = {
    'userName': '',
    'role': '',
    'email': '',
    'operation': '',
    'activeIcon': '',
    'editIcon': '',
    'saveIcon': '',
    'cancelIcon': '',
    'deleteIcon': '',
    'noDataMessage': ''
  };

  public modalRef: BsModalRef;
  public roleList = [
    {'roleId': '21453f5a-a910-43a3-a33c-270606edfb5e', 'roleName': 'ADMIN'},
    {'roleId': '06183543-9af4-4ccc-8b80-43140ddc6a6d', 'roleName': 'MANAGER'},
    {'roleId': 'bc7fafb8-5394-4f07-843e-f12d23aaca84', 'roleName': 'USER'},
    {'roleId': '7680cdac-4f9d-4a47-9cb3-06154d4279ff', 'roleName': 'ACTUATOR'}
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
              private translate: TranslateService,
              private globalLanguageService: GlobalLanguageEventService) {
    this.selectTestId = 0;
    this.selectUserId = 0;
    this.currentLength = 0;
    this.currentCode = '';
    this.selectedRoleName = 'USER';
    this.user.mainShowing = false;
    // @ts-ignore
    this.tableData = [];
    this.source = new LocalDataSource(this.tableData);
  }

  initTranslate() {
    this.translate.get('userName').subscribe(label => {
      this.translateList.userName = label;
    });
    this.translate.get('role').subscribe(label => {
      this.translateList.role = label;
    });
    this.translate.get('email').subscribe(label => {
      this.translateList.email = label;
    });
    this.translate.get('operation').subscribe(label => {
      this.translateList.operation = label;
    });
    this.translate.get('activeIcon').subscribe(label => {
      this.translateList.activeIcon = label;
    });
    this.translate.get('editIcon').subscribe(label => {
      this.translateList.editIcon = label;
    });
    this.translate.get('saveIcon').subscribe(label => {
      this.translateList.saveIcon = label;
    });
    this.translate.get('cancelIcon').subscribe(label => {
      this.translateList.cancelIcon = label;
    });
    this.translate.get('deleteIcon').subscribe(label => {
      this.translateList.deleteIcon = label;
    });
    this.translate.get('noDataMessage').subscribe(label => {
      this.translateList.noDataMessage = label;
      this.setTableSettings();
    });
  }

  setTableSettings() {
    this.settings = {
      actions: {
        columnTitle: '',
        add: false,
        position: 'right',
        custom: [
          {
            name: 'assign',
            title: '<i title="' + this.translateList.activeIcon +
              '" class="fa fa-1x fa-legal" aria-hidden="true"></i><i>       </i>',
          }
        ]
      },
      columns: {
        name: {
          title: this.translateList.userName,
          filter: false,
          editable: false
        },
        // IOT permission, 去掉角色显示
        /*roles: {
          title: this.translateList.role,
          filter: false,
          editor: {
            type: 'list',
            config: {
              list: [
                { value: 'ADMIN', title: 'ADMIN' },
                { value: 'MANAGER', title: 'MANAGER' },
                { value: 'USER', title: 'USER' },
                { value: 'ACTUATOR', title: 'ACTUATOR' }
              ]
            }
          }
        },*/
        email: {
          title: this.translateList.email,
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
      edit: {
        position: 'right',
        editButtonContent: '<i title="' + this.translateList.editIcon +
          '" class="fa fa-1x fa-pencil-square" aria-hidden="true"></i><i>       </i>',
        saveButtonContent: '<i title="' + this.translateList.saveIcon +
          '" class="fa fa-1x fa-check"></i><i>       </i>',
        cancelButtonContent: '<i title="' + this.translateList.cancelIcon +
          '" class="fa fa-1x fa-close"></i>',
        confirmSave: true
      },
      delete: {
        position: 'right',
        deleteButtonContent: '<i title="' + this.translateList.deleteIcon +
          '" class="fa fa-1x fa-trash" aria-hidden="true"></i>',
        confirmDelete: true
      },
      attr: {
        class: 'table table-striped table-bordered table-hover'
      },
      defaultStyle: true,
      noDataMessage: this.translateList.noDataMessage
    };
  }

  getData() {
    // @ts-ignore
    this.tableData = [];
    this.source = new LocalDataSource(this.tableData);
    this.taskService.getAllUser().subscribe( res => {
      // @ts-ignore
      const userJson = JSON.parse(res._body);
      if (userJson.hasOwnProperty('_embedded')) {
        this.userList = userJson._embedded.users;
        for ( let i = 0; i < this.userList.length; i++) {
          const item = {'id': '', 'name': '', 'email': '', 'roles': ''};
          item.id = this.userList[i].user.userId;
          item.name = this.userList[i].user.username;
          item.email = this.userList[i].user.email;
          // IOT permission, 去掉角色显示
          /*if (this.userList[i].user.roles.length > 0) {
            item.roles = this.userList[i].user.roles[0].name;
          }*/
          this.tableData.push(item);
        }
      }
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
  ngOnInit() {
    this.initTranslate();
    // LISTEN TO EVENTS
    this.globalLanguageService.languageChanged.subscribe(item => {
      this.initTranslate();
    });
    this.getData();
  }

  onSearch(query) {
    // @ts-ignore
    this.mainTable.isAllSelected = false;
    if (query === '') {
      this.ngOnInit();
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
            // IOT permission, 去掉角色显示
            /*if (this.userList[i].user.roles.length > 0) {
              item.roles = this.userList[i].user.roles[0].name;
            }*/
            this.tableData2.push(item);
          }
        }
        this.source = new LocalDataSource(this.tableData2);
        this.currentLength = this.tableData2.length;
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
                title: this.translate.instant('deleteUserFail'),
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


  getRoleIdByName(roleName) {
    const roleIdSet = [];
    for (let i = 0; i < this.roleList.length; i++) {
      if (this.roleList[i].roleName === roleName) {
        for (let j = i; j < this.roleList.length; j++) {
          roleIdSet.push({'roleId': this.roleList[j].roleId});
        }
        break;
      }
    }
    return roleIdSet;
  }
  onSaveConfirm(event) {
    const userObj = {
      'userId': event.newData.id,
      'username': event.newData.name,
      'email': event.newData.email,
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
        if (this.isEmail(event.newData.email)) {
          this.taskService.updateUser(userObj).subscribe(res => {
              console.log(res);
              if (res.status  >= 200) {
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
        } else {
          // @ts-ignore
          Swal.fire({
            title: this.translate.instant('emailFail'),
            type: 'error',
            showConfirmButton: true,
            timer: 3000
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  openCreateModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-model'});
    this.selectedRoleName = 'USER';
    this.newUser = new User();
  }

  openAssignModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-model'});
    this.param.testIds[0] = this.selectTestId;
    this.param.userIds[0] = this.selectUserId;
  }

  createNewUser() {
    this.newUser.roles = this.getRoleIdByName(this.selectedRoleName);
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
        // 验证邮箱地址合法
        if (this.isEmail(this.newUser.email)) {
          this.taskService.createUser(this.newUser).subscribe(res => {
              console.log(res);
              if (res.status >= 200) {
                // @ts-ignore
                Swal.fire({
                  title: this.translate.instant('createSuccess'),
                  type: 'success',
                  showConfirmButton: true,
                  timer: 3000
                });
                this.modalRef.hide();
                this.ngOnInit();
              }
            },
            error => {
              // @ts-ignore
              Swal.fire({
                title: this.translate.instant('createUserFail'),
                type: 'error',
                showConfirmButton: true,
                timer: 3000
              });
            });
        } else {
          // @ts-ignore
          Swal.fire({
            title: this.translate.instant('emailFail'),
            type: 'error',
            showConfirmButton: true,
            timer: 3000
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  isEmail(str) {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(str);
  }

  generateCode() {
    this.taskService.getTestById(this.param.testIds[0]).subscribe( data => {
      // @ts-ignore
      const testJson = JSON.parse(data._body);
      if (testJson.hasOwnProperty('_embedded')) {
        if (testJson._embedded.tests[0].test.questions.length > 0) {
          this.taskService.generateActiveCode(this.param).subscribe( res => {
            // @ts-ignore
            const codeJson = JSON.parse(res._body);
            console.log(codeJson);
            if (codeJson.hasOwnProperty('license')) {
              // @ts-ignore
              this.currentCode = codeJson.license.licenceKey;
              Swal(
                this.translate.instant('generateSuccess'),
                this.translate.instant('generateDetail') + this.currentCode,
                'success'
              );
              this.modalRef.hide();
            } else {
              // @ts-ignore
              Swal.fire({
                title: this.translate.instant('generateFail'),
                type: 'error',
                showConfirmButton: true,
                timer: 3000
              });
            }
          }, error => {
            // @ts-ignore
            Swal.fire({
              title: this.translate.instant('generateFail'),
              type: 'error',
              showConfirmButton: true,
              timer: 3000
            });
          });
        } else {
          // @ts-ignore
          Swal.fire({
            title: this.translate.instant('testZeroAlert'),
            type: 'error',
            showConfirmButton: true,
            timer: 3000
          });
        }
      }
    }, error => {
      // @ts-ignore
      Swal.fire({
        title: this.translate.instant('generateFail'),
        type: 'error',
        showConfirmButton: true,
        timer: 3000
      });
    });
  }
}
