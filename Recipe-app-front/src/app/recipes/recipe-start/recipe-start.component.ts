import { Component } from '@angular/core';

@Component({
  selector: 'app-recipe-start',
  templateUrl: './recipe-start.component.html',
  styleUrls: ['./recipe-start.component.css']
})
export class RecipeStartComponent {
  //Der pfad zum bild
  imagePath: string = 'http://localhost:8080/resources/rezeptBuchLogoNew.jpg';
}
