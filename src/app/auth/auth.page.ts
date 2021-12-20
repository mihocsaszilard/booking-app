import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLogin = true;
  isLoading = false;

  constructor(
    private autService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Logging in...'
      })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.autService.login(email, password);
        } else {
          authObs = this.autService.signUp(email, password);
        }
        authObs.subscribe(res => {
          console.log(res);
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            const message = `${code.charAt(0) + code.slice(1).toLowerCase().replace(/_/g, ' ')}!`;
            this.showAlert(message);
          }
        );
      });
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);

    this.authenticate(email, password);
  }

  onSwitchAuth() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed!',
      message,
      buttons: ['OK']
    }).then(alertEl => {
      alertEl.present();
    });
  }

}
