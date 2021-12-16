import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLogin = false;


  constructor(private autService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogin() {
    this.autService.login();
    this.router.navigateByUrl('/places/tabs');
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);

    if (this.isLogin) {
      // send a request to login
    } else {
      // send request to sing up
    }
  }

  onSwitchAuth() {
    this.isLogin = !this.isLogin;
  }
}
