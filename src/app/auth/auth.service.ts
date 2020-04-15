import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseDate {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean // ? to make it optionnal (required for login but not for signup)
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // user = new BehaviorSubject<User>(null); // Get access to the previously emitted values, even before having subscribed to it;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) { }

  private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.store.dispatch(new AuthActions.Login({ email: email, userId: userId, token: token, expirationDate: expirationDate }));
    this.autoLogout(expiresIn * 1000); // we expects milliseconds in a timeout
    localStorage.setItem('user', JSON.stringify(user));
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseDate>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.API_KEY}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseDate>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.API_KEY}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
    }));
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured !';
    if (!err.error || !err.error.error) {
      return throwError(errorMessage);
    }
    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists !';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email or password are incorrect';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Email or password are incorrect';
        break;
    }
    return throwError(errorMessage)
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      return;
    }
    const date = new Date(userData._tokenExpirationDate);
    const loadedUser = new User(userData.email, userData.id, userData._token, date);
    if (loadedUser.token) {
      this.store.dispatch(new AuthActions.Login({
        email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: date
      }))
      const expirationDuration = date.getTime() - new Date().getTime()
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout())
    this.router.navigate(['/auth']);
    localStorage.removeItem('user');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);

  }
}
