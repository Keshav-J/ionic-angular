/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated= false;

  constructor() { }

  get userIsAuthenticated() {
    this._userIsAuthenticated = (localStorage.getItem('userIsAuthenticated') === 'true');
    return this._userIsAuthenticated;
  }

  login() {
    localStorage.setItem('userIsAuthenticated', 'true');
    this._userIsAuthenticated = true;
  }

  logout() {
    localStorage.removeItem('userIsAuthenticated');
    this._userIsAuthenticated = false;
  }
}
