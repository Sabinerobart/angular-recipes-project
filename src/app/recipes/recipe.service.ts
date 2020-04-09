import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({ providedIn: 'root' })

export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     "Blueberry pie",
  //     "Who doesn't love blueberry pies ?",
  //     "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
  //     [new Ingredient('Blueberry', 30), new Ingredient('Sugar', 100)]
  //   ),
  //   new Recipe(
  //     "Blueberry muffins",
  //     "Delicious blueberry muffins",
  //     "https://images.unsplash.com/photo-1525124541374-b7eaf79d0dbf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  //     [new Ingredient('Blueberry', 30), new Ingredient('Sugar', 70), new Ingredient('Flour', 100)]
  //   )
  // ];

  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    // The empty .slice() returns a copy of the original array
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes.slice()[index]
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    // Creates a new array of recipes with the recipe newly created
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}