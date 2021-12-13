import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userIsAuth = true; // set to true because need to login with every refresh

  get getUserIsAuth() {
    return this.userIsAuth;
  }

  constructor() { }

  login() {
    this.userIsAuth = true;
  }

  logout() {
    this.userIsAuth = false;
  }
}
