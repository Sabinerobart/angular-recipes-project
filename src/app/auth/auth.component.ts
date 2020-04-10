import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService, AuthResponseDate } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseDate>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      this.isLoading = true;
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe(res => console.log(res), errorMessage => {
      // Without the pipe in the auth.service :
      // switch (err.error.error.message) {
      //   case 'EMAIL_EXISTS':
      //     this.error = 'This email already exists !';
      // }
      console.log(errorMessage);
      this.error = errorMessage;
      this.isLoading = false;
    })
    form.reset();
    this.error = '';
  }

}
