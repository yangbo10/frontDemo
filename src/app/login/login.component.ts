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
  languages: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService, private modalService: BsModalService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.languages = [
      {label: '中文', value: 'cn'},
      {label: '英文', value: 'en'}
    ];
    // reset login status
    this.taskService.logOut().subscribe( res => {
      console.log(res);
    });

  }

  changeLang(lang) {
    console.log(lang);
  }

  login() {
    this.taskService.login(this.user.username, this.user.password);
  }

  openCreateModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg create-modal'});
  }

  registerUser() {
    this.taskService.registerUser(this.newUser).subscribe( res => {
      Swal(
        this.translate.instant('registerSuccess'),
        '',
        'success'
      );
      this.modalRef.hide();
    }, error => {
      Swal(
        this.translate.instant('registerFail'),
        '',
        'error'
      );
    });
  }
}

