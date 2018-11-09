import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {User} from '../models/user';
import {LocalDataSource} from 'ng2-smart-table';
import {TaskService} from '../service/taskService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usermanage',
  templateUrl: './usermanage.component.html',
  styleUrls: ['./usermanage.component.css']
})
export class UsermanageComponent implements OnInit {

  userList: [any];
  tableData: [any];
  source: LocalDataSource;
  newUser: User = new User();
  public modalRef: BsModalRef;
  public roleList = [
    {'roleId': 1, 'roleName': 'ADMIN'},
    {'roleId': 2, 'roleName': 'MANAGER'},
    {'roleId': 3, 'roleName': 'USER'}
  ];

  constructor(public user: User, private taskService: TaskService, private modalService: BsModalService) {
  }

  public settings = {
    columns: {
      name: {
        title: '用户名称',
        filter: false,
        editable: false
      },
      roles: {
        title: '用户角色',
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
        title: '用户详情',
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
    this.taskService.getAllUser().subscribe( res => {
      // @ts-ignore
      const userJson = JSON.parse(res._body);
      this.userList = userJson._embedded.users;
      // @ts-ignore
      this.tableData = [];
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
        this.taskService.deleteUser(event.data.id).subscribe(res => {
            console.log(res);
            if (res.status  >= 200) {
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
      title: '确认修改？',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        this.taskService.updateUser(userObj).subscribe(res => {
            console.log(res);
            if (res.status  >= 200) {
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

  createNewUser() {
    const maxRoleId = this.newUser.roles[0].roleId;
    for ( let i = 1; i <= maxRoleId; i++ ) {
      this.newUser.roles.push({'roleId': i});
    }
    console.log(this.newUser);
    Swal({
      title: '确认创建？',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        this.taskService.createUser(this.newUser).subscribe(res => {
            console.log(res);
            if (res.status >= 200) {
              Swal(
                '创建成功',
                '',
                'success'
              );
              this.modalRef.hide();
              this.ngOnInit();
            }
          },
          error => {
            Swal(
              '创建失败',
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
}