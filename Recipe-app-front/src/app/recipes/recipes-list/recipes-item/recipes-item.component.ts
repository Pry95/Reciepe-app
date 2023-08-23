import { Component, Input } from '@angular/core';
import { Recipe } from '../../../Models/recipe.model';


@Component({
  selector: 'app-recipes-item',
  templateUrl: './recipes-item.component.html',
  styleUrls: ['./recipes-item.component.css']
})
export class RecipesItemComponent {

  @Input() recipe: Recipe;

}
