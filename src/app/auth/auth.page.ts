import { AlertController, LoadingController } from '@ionic/angular';
import { AuthResponseData, AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
  }

  // onLogin() {
  //   this.loadingCtrl
  //     .create({keyboardClose: true, message: 'Loggin in...'})
  //     .then(loadingEl => {
  //       this.isLoading = true;
  //       loadingEl.present();
  //       this.authService.login();
  //       setTimeout(() => {
  //         this.isLoading = false;
  //         loadingEl.dismiss();
  //         this.router.navigateByUrl('/places/tabs/discover');
  //       }, 1500);
  //     });
  // }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: this.isLogin ? 'Loggin in...' : 'Signing up...'
      })
      .then(loadingEl => {
        this.isLoading = true;
        loadingEl.present();
        let $authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          $authObs = this.authService.login(email, password);
        } else {
          $authObs = this.authService.signup(email, password);
        }
        $authObs.subscribe(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        },
        (err) => {
          this.isLoading = false;
          loadingEl.dismiss();
          let message = 'Could not sign you up, please try again.';
          switch (err.error.error.message) {
            case 'EMAIL_EXISTS':    message = 'This email exists already!'; break;
            case 'EMAIL_NOT_FOUND': message = 'E-mail could not be found.'; break;
            case 'INVALID_PASSWORD': message = 'This password is not correct.'; break;
          }
          this.showAlert(message);
        });
      });
    form.reset();
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication Failed!',
      message,
      buttons: ['Okay']
    }).then(alertEl => {
      alertEl.present();
    });
  }

}
