import { BehaviorSubject, Observable, from } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { map, tap } from 'rxjs/operators';

/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Storage } from '@capacitor/storage';
import { User } from './user.model';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => user ? !!user.token : false));
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => user ? user.id : null));
  }

  get token() {
    return this._user.asObservable().pipe(map(user => user ? user.token : null));
  }

  constructor(
    private http: HttpClient,
  ) { }

  ngOnDestroy(): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  autoLogin() {
    return from(Storage.get({key: 'authData'})).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => !!user)
    );
  }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      {email, password, returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      {email, password, returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Storage.remove({key: 'authData'});
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime,
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.localId, userData.email, userData.idToken, expirationTime.toISOString());
  }

  private storeAuthData(userId: string, email: string, token: string, tokenExpirationDate: string) {
    const data = {userId, email, token, tokenExpirationDate};
    Storage.set({
      key: 'authData',
      value: JSON.stringify(data)
    });
  }
}
