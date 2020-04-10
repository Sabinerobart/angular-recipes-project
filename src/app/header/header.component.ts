import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataService } from '../shared/data.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit, OnDestroy {

  userSub: Subscription;
  isAuthenticated: boolean = false;

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user
    });
  }

  onSaveData() {
    this.dataService.storeRecipes();
  }

  onFetchData() {
    this.dataService.fetchRecipes().subscribe();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
