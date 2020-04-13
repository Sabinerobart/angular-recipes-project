import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { AuthGuard } from '../auth/auth-guard.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: ShoppingListComponent, canActivate: [AuthGuard] }]),
    FormsModule
  ]
})
export class ShoppingListModule {

}