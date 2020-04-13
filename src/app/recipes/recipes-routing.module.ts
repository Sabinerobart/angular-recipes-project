import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesComponent } from './recipes.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesResolverService } from './recipes-resolver.service';
import { AuthGuard } from '../auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard], children: [
      { path: '', component: RecipeStartComponent, resolve: [RecipesResolverService] },
      { path: 'new', component: RecipeEditComponent, resolve: [RecipesResolverService] },
      { path: ':id', component: RecipeDetailComponent },
      { path: ':id/edit', component: RecipeEditComponent },
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class RecipesRoutingModule {

}