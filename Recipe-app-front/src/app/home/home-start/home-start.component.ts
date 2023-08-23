import { Component , OnInit } from '@angular/core';
import { FriendsService } from 'src/app/_services/friens.service';
import { RecipeService } from 'src/app/_services/recipe.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-home-start',
  templateUrl: './home-start.component.html',
  styleUrls: ['./home-start.component.css']
})
export class HomeStartComponent implements OnInit {
constructor(
  protected tokenStorageService: TokenStorageService,
  private frienService: FriendsService,
  private recipeService: RecipeService,
){}

  imagePath: string = 'http://localhost:8080/resources/rezeptBuchLogoNew.jpg';
  isLoggedIn: boolean = false;
  userName: string = '';

  ngOnInit(): void {
    //Es wird überprüft ob de user eingelogt ist oder nicht
    const isAuthenticated = this.tokenStorageService.getUser()
    const token = this.tokenStorageService.getToken();
    if(isAuthenticated && token){
      this.userName = isAuthenticated.username
      this.isLoggedIn = true;
    }
  }
//Hier wird zum rezeptBuch gewechselt
  onRecipes(){
    this.frienService.friendModeChanged.next(false);
    this.recipeService.publicModeChanged.next(false);
    console.log('falsch')
  }
}
