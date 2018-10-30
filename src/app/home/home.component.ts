import { Component, OnInit } from '@angular/core';
import {TaskService} from '../service/taskService';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {User} from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mainPageShowing: boolean;

  constructor(public user: User, private taskService: TaskService, private router: Router) {
    this.user.mainShowing = true;
}

  ngOnInit() {
    if (localStorage.getItem('access_token') === null) {
      this.router.navigate(['']);
    }
  }

  logOut() {
    Swal({
      title: '确认注销当前用户？',
      text: '将会跳转至登录页',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        Swal(
          '注销成功',
          '',
          'success'
        );
        this.taskService.logOut().subscribe( res => {
          console.log(res);
          this.router.navigate(['']);
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

  changePage() {
    this.user.mainShowing = false;
  }
}
