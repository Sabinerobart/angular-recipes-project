import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseDate {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean // ? to make it optionnal (required for login but not for signup)
}

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }

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
        map(resData => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          return new AuthActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate: expirationDate
          });
        }),
        catchError(err => {
          let errorMessage = 'An unknown error occured !';
          if (!err.error || !err.error.error) {
            return of(new AuthActions.LoginFail(errorMessage));
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
          return of(new AuthActions.LoginFail(errorMessage)); // this is a new observable.
        })
      )
    })) // no catchError() here or the whole effect dies


  @Effect({ dispatch: false }) // Doesn't yiels a dispatchable action
  authSuccess = this.actions$.pipe(ofType(AuthActions.LOGIN), tap(() => {
    this.router.navigate(['/'])
  }))
}