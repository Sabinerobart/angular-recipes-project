import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './auth.service';

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

    if (this.isLoginMode) {
      //...
    } else {
      this.isLoading = true;
      this.authService.signup(email, password).subscribe(res => console.log(res), errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
        // Without the pipe in the auth.service :
        // switch (err.error.error.message) {
        //   case 'EMAIL_EXISTS':
        //     this.error = 'This email already exists !';
        // }
      })
    }
    form.reset();
  }

}
