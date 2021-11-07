import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private recipesList: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageURL: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Breitenlesau_Krug_Br%C3%A4u_Schnitzel.JPG',
      ingredients: ['French Fries', 'Pork Meat', 'Salad']
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageURL: 'https://hips.hearstapps.com/hmg-prod/images/homemade-spaghetti-sauce-horizontal-1530890913.jpg',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes']
    }
  ];

  private recipesList$ = new Subject<Recipe[]>();

  constructor() { }

  getRecipesListAsObservable(): Observable<Recipe[]> {
    return this.recipesList$.asObservable();
  }

  getAllRecipes(): Recipe[] {
    return [...this.recipesList];
  }

  getRecipe(recipeId: string): Recipe {
    return {...this.recipesList.find(recipe => recipe.id === recipeId)};
  }

  deleteRecipe(recipeId: string): void {
    this.recipesList = this.recipesList.filter(recipe => recipe.id !== recipeId);
    this.recipesList$.next(this.recipesList);
  }
}
