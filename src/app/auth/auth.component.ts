import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService, AuthResponseDate } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
      this.isLoading = authState.loading;
    })
  }


  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(errorMessage: string) {
    // const alertComp = new AlertComponent(); // Valid typescript code but not valid angular code
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent); // Pass the type of the component so that Angular knows what
    // component it should generate for you
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = errorMessage;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseDate>;

    this.isLoading = true;
    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email: email, password: password }));
    } else {
      authObs = this.authService.signup(email, password);
    }
    form.reset();
    this.error = '';
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
}
