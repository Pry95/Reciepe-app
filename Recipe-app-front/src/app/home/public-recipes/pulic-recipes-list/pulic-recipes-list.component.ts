import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/Models/recipe.model';
import { RecipeService } from 'src/app/_services/recipe.service';

@Component({
  selector: 'app-pulic-recipes-list',
  templateUrl: './pulic-recipes-list.component.html',
  styleUrls: ['./pulic-recipes-list.component.css']
})
export class PulicRecipesListComponent implements OnInit {
publicRecipes: Recipe[] = [];

constructor(private recipeService: RecipeService){}
ngOnInit(): void {
  this.publicRecipes = []
  this.publicRecipes = this.recipeService.getPublicRecipes();
  this.recipeService.publicRecipesChanged.subscribe(recipes => {
    this.publicRecipes = recipes.map((recipe) => ({ ...recipe }));
    
  });
}
}
