import {Injectable} from '@angular/core';

@Injectable()
export class User {
  public username: string;
  public password: string;
  public roles: any;
  public mainShowing: boolean;
  public overallScore: number;
  public email: string;
  public phone: string;
  constructor() {
    this.username = '';
    this.password = '';
    this.roles = [{'roleId': 3, 'rolesName': ''}];
    this.mainShowing = false;
    this.overallScore = 0;
    this.email = '';
    this.phone = '';
  }
}
