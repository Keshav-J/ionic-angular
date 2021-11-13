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
  // recipesListSubscription: Subscription;

  constructor(
    private recipesService: RecipesService
  ) { }

  ngOnInit() {
    this.recipes = this.recipesService.getAllRecipes();
    // this.recipesListSubscription = this.recipesService.getRecipesListAsObservable().subscribe(recipesList => {
    //   this.recipes = recipesList;
    // });
  }

  ionViewWillEnter() {
    console.log('will enter');
    this.recipes = this.recipesService.getAllRecipes();
  }

  ionViewDidEnter() {
    console.log('did enter');
  }

  ionViewWillLeave() {
    console.log('will leave');
  }

  ionViewDidLeave() {
    console.log('did leave');
  }

  ngOnDestroy(): void {
    console.log('destroy called');
    // this.recipesListSubscription.unsubscribe();
  }

}
