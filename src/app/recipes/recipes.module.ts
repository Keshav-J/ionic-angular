import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';
import { RecipesPage } from './recipes.page';
import { RecipesPageRoutingModule } from './recipes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipesPageRoutingModule
  ],
  declarations: [
    RecipesPage,
    RecipeItemComponent
  ]
})
export class RecipesPageModule {}
