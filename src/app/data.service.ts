import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Recipe } from './recipes/recipe.model';
import { RecipeService } from './recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    // // with Firebase, you use .post() to send 1 element, now with .put() you can overwrite whatever is on
    // // the endpoint and send the whole package
    this.http.put('https://ng-recipes-96b5e.firebaseio.com/recipes.json', recipes).subscribe(response => console.log(response));
  }

  fetchRecipes() {
    // Add type on the .get() to inform typescipt that the response will be in the form of an array of recipes (Recipe[])
    this.http.get<Recipe[]>('https://ng-recipes-96b5e.firebaseio.com/recipes.json').subscribe(recipes => {
      this.recipeService.setRecipes(recipes);
    })
  }
}
