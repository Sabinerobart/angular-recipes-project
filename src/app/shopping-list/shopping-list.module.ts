import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { AuthGuard } from '../auth/auth-guard.service';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'shopping-list', component: ShoppingListComponent, canActivate: [AuthGuard] },
    ]),
    FormsModule
  ]
})
export class ShoppingListModule {

}