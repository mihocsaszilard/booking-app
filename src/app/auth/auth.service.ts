import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userIsAuth = false;

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
