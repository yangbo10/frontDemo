import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../service/taskService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any = {};
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService) {
  }

  ngOnInit() {
    // reset login status
    this.taskService.logOut().subscribe( res => {
      console.log(res);
    });

  }

  login() {
    this.taskService.login(this.user.username, this.user.password);
  }
}

