import { Component, OnDestroy, OnInit } from '@angular/core';

import { Recipe } from './recipe.model';
import { RecipesService } from './recipes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit, OnDestroy {

  recipes: Recipe[] = [];
  recipesListSubscription: Subscription;

  constructor(
    private recipesService: RecipesService
  ) { }

  ngOnInit() {
    this.recipes = this.recipesService.getAllRecipes();
    this.recipesListSubscription = this.recipesService.getRecipesListAsObservable().subscribe(recipesList => {
      this.recipes = recipesList;
    });
  }

  ngOnDestroy(): void {
    this.recipesListSubscription.unsubscribe();
  }

}
