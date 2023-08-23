import { Component } from '@angular/core';
import { RecipeService } from 'src/app/_services/recipe.service';

@Component({
  selector: 'app-search-pulic-recipes',
  templateUrl: './search-public-recipes.component.html',
  styleUrls: ['./search-public-recipes.component.css']
})
export class SearchPulicRecipesComponent {

  inputValue: string;
constructor(private recipeService: RecipeService){}

//Hier werden die Öffenlichen Rezepte gesucht
searchPublicRecipes(){
  this.recipeService.getPublicRecipesFromDatabase(this.inputValue)
}
 
}
