import { Component, OnInit } from '@angular/core';
import {TaskService} from '../service/taskService';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {User} from '../models/user';
import {toNumber} from '../../../node_modules/ngx-bootstrap/timepicker/timepicker.utils';
import {BsModalService} from 'ngx-bootstrap';
import {TranslateService} from 'ng2-translate';
import {GlobalLanguageEventService} from '../service/global-language-event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedLanguage = 'cn';

  constructor(public user: User, private taskService: TaskService, private router: Router,
              private translate: TranslateService, public globalEventService: GlobalLanguageEventService) {
    this.user.mainShowing = true;
    this.user.roles[0].roleId = localStorage.getItem('user_role');
    if (localStorage.getItem('language') === 'cn') {
      this.translate.setDefaultLang('cn');
      this.translate.use('cn');
    } else {
      localStorage.setItem('language', 'en');
      this.translate.setDefaultLang('en');
      this.translate.use('en');
    }
    /*translate.addLangs(['en', 'cn']);
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|cn/) ? browserLang : 'cn');*/
}

  ngOnInit() {
    /*if (localStorage.getItem('access_token') === null) {
      this.router.navigate(['']);
    }*/
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
        // @ts-ignore
        Swal.fire({
          title: this.translate.instant('logOutSuccess'),
          type: 'success',
          showConfirmButton: true,
          timer: 3000
        });
        this.taskService.logOut().subscribe( res => {
          console.log(res);
          this.router.navigate(['']);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  goHome() {
    this.user.mainShowing = true;
    this.router.navigate(['home']);
  }

  changePage() {
    this.user.mainShowing = false;
  }

  changeLanguage() {
    if (this.translate.currentLang === 'cn') {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      this.selectedLanguage = 'en';
      this.globalEventService.setLanguage(this.selectedLanguage);
      localStorage.setItem('language', 'en');
    } else {
      this.translate.setDefaultLang('cn');
      this.translate.use('cn');
      this.selectedLanguage = 'cn';
      this.globalEventService.setLanguage(this.selectedLanguage);
      localStorage.setItem('language', 'cn');
    }
    this.ngOnInit();
  }

}
