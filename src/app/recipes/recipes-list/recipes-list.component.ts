import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Recipe } from "../recipe.model";

@Component({
  selector: "app-recipes-list",
  templateUrl: "./recipes-list.component.html",
  styleUrls: ["./recipes-list.component.css"]
})
export class RecipesListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe(
      "Blueberry pie",
      "Who doesn't love blueberry pies ?",
      "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
    ),
    new Recipe(
      "Blueberry muffins",
      "Delicious blueberry muffins",
      "https://images.unsplash.com/photo-1525124541374-b7eaf79d0dbf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    )
  ];

  constructor() {}

  ngOnInit() {}

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
