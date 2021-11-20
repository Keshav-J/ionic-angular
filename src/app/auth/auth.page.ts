import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
  }

  onLogin() {
    this.loadingCtrl
      .create({keyboardClose: true, message: 'Loggin in...'})
      .then(loadingEl => {
        this.isLoading = true;
        loadingEl.present();
        this.authService.login();
        setTimeout(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, 1500);
      });
  }

}
