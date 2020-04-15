import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseDate {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean // ? to make it optionnal (required for login but not for signup)
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('user', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate
  });
};

const handleError = (err: any) => {
  let errorMessage = 'An unknown error occured !';
  if (!err.error || !err.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
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
  return of(new AuthActions.AuthenticateFail(errorMessage)); // this is a new observable.
}

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseDate>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.API_KEY}`, {
        email: signupAction.payload.email,
        password: signupAction.payload.password,
        returnSecureToken: true
      }).pipe(
        tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
        map(resData => handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)),
        catchError(err => handleError(err))
      )
    }));

  @Effect()
  // Subscribes automatically
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseDate>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.API_KEY}`, {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(
        tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
        map(resData => handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)),
        catchError(err => handleError(err))
      )
    })) // no catchError() here or the whole effect dies


  @Effect({ dispatch: false }) // Doesn't yields a dispatchable action
  authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT), tap(() => {
    this.router.navigate(['/'])
  }))

  @Effect()
  autoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN), map(() => {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      return { type: 'DUMMY' };
    }
    const date = new Date(userData._tokenExpirationDate);
    const loadedUser = new User(userData.email, userData.id, userData._token, date);
    if (loadedUser.token) {
      const expirationDuration = date.getTime() - new Date().getTime();
      this.authService.setLogoutTimer(expirationDuration);
      return new AuthActions.AuthenticateSuccess({
        email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: date
      })
    }
    return { type: 'DUMMY' };
  }))

  @Effect({ dispatch: false })
  autoLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() => {
    this.authService.clearLogoutTimer();
    localStorage.removeItem('user');
  }))
}