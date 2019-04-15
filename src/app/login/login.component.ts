import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../service/taskService';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {User} from '../models/user';
import Swal from 'sweetalert2';
import {TranslateService} from 'ng2-translate';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any = {};
  loading = false;
  public modalRef: BsModalRef;
  newUser: User = new User();
  passwordConfirm: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService, private modalService: BsModalService, private translate: TranslateService) {
    this.passwordConfirm = '';
  }

  ngOnInit() {
    if (localStorage.getItem('language') === 'en') {
      this.translate.use('en');
    } else {
      localStorage.setItem('language', 'cn');
      this.translate.use('cn');
    }
    // reset login status
    this.taskService.logOut().subscribe( res => {
      console.log(res);
    });

  }

  changeLanguage() {
    if (this.translate.currentLang === 'cn') {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      localStorage.setItem('language', 'en');
    } else {
      this.translate.setDefaultLang('cn');
      this.translate.use('cn');
      localStorage.setItem('language', 'cn');
    }
    this.ngOnInit();
  }

  login() {
    this.taskService.login(this.user.username, this.user.password);
  }

  openCreateModal(template: TemplateRef<any>) {
    this.newUser =  new User();
    this.passwordConfirm = '';
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-modal'});
  }

  registerUser() {
    const signUpUser = {'username': this.newUser.username, 'password': this.newUser.password}
    if (this.newUser.password === this.passwordConfirm) {
      this.taskService.registerUser(signUpUser).subscribe( res => {
        Swal(
          this.translate.instant('registerSuccess'),
          '',
          'success'
        );
        this.modalRef.hide();
      }, error => {
        Swal(
          this.translate.instant('createUserFail'),
          '',
          'error'
        );
      });
    } else {
      Swal(
        this.translate.instant('passwordNotSame'),
        '',
        'error'
      );
    }
  }
}

