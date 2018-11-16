import { Component, OnInit } from '@angular/core';
import {TaskService} from '../service/taskService';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {User} from '../models/user';
import {toNumber} from '../../../node_modules/ngx-bootstrap/timepicker/timepicker.utils';
import {BsModalService} from 'ngx-bootstrap';
import {TranslateService} from 'ng2-translate';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public user: User, private taskService: TaskService, private router: Router, private translate: TranslateService) {
    this.user.mainShowing = true;
    this.user.roles[0].roleId = toNumber(localStorage.getItem('user_role'));
    this.translate.setDefaultLang('cn');
    this.translate.use('cn');
}

  ngOnInit() {
    console.log(this.user.roles[0].roleId);
    if (localStorage.getItem('access_token') === null) {
      this.router.navigate(['']);
    }
  }

  logOut() {
    Swal({
      title: this.translate.instant('logOutConfirm'),
      text: this.translate.instant('logOutConfirmDescribe'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('sure'),
      cancelButtonText: this.translate.instant('cancel')
    }).then((result) => {
      if (result.value) {
        Swal(
          this.translate.instant('logOutSuccess'),
          '',
          'success'
        );
        this.taskService.logOut().subscribe( res => {
          console.log(res);
          this.router.navigate(['']);
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

  changePage() {
    this.user.mainShowing = false;
  }

  changeLanguage() {
    console.log(this.translate.currentLang);
    if (this.translate.currentLang === 'cn') {
      this.translate.use('en');
    } else {
      this.translate.use('cn');
    }
    this.ngOnInit();
  }
}
