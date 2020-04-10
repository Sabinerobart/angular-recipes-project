import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseDate {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseDate>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.API_KEY}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(err => {
      let errorMessage = 'An unknown error occured !';
      if (!err.error || !err.error.error) {
        return throwError(errorMessage);
      }
      switch (err.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exists !';
      }
      return throwError(errorMessage)
    }));
  }

  signin() {

  }
}
