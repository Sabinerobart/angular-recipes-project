import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }
  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    // // with Firebase, you use .post() to send 1 element, now with .put() you can overwrite whatever is on
    // // the endpoint and send the whole package
    this.http.put('https://ng-recipes-96b5e.firebaseio.com/recipes.json',
      recipes
    ).subscribe(response => console.log(response));
  }

  fetchRecipes() {
    // Add type on the .get() to inform typescipt that the response will be in the form of an array of recipes (Recipe[])
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      return this.http.get<Recipe[]>('https://ng-recipes-96b5e.firebaseio.com/recipes.json',
        { params: new HttpParams().set('auth', user.token) })
    }), map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
      tap(recipes => this.recipeService.setRecipes(recipes))
    );
    // take(1) takes 1 value on the observable, then automatically unsubscribes
    // exhaustMap waits for the 1st observable to complete before executing the next one;

  }
}
