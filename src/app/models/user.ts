import {Injectable} from '@angular/core';

@Injectable()
export class User {
  public id: number;
  public password: string;
  public mainShowing: boolean;
  constructor() {
    this.id = 0;
    this.password = '';
    this.mainShowing = false;
  }
}
