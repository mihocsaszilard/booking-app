import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userIsAuth = true; // set to true because need to login with every refresh
  private userId = 'xz';

  get getUserIsAuth() {
    return this.userIsAuth;
  }

  get getUserId() {
    return this.userId;
  }

  constructor() { }

  login() {
    this.userIsAuth = true;
  }

  logout() {
    this.userIsAuth = false;
  }
}
