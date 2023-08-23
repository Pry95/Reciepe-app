import { Component ,Input} from '@angular/core';
import { Recipe } from 'src/app/Models/recipe.model';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent {
@Input() recipe: Recipe;
@Input() index: number;
}
