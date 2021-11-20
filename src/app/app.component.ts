import { AuthService } from './auth/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
