import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { RecipeService } from '../_services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CopiedService } from '../_services/copied.service';
import { RatingService } from '../_services/rating.serive';
import { ToastService } from '../_services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  imagePath: string = 'http://localhost:8080/resources/rezeptBuchLogoNew.jpg';
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  userImage: string = '';
  copiedListIds: number[] = [];
  ratedListIds: number[] = [];
  toDoListIds: number[] = [];
  

  constructor(
    private authService: AuthService, 
    private tokenStorage: TokenStorageService,
    protected recipeService: RecipeService,
    protected copiedService: CopiedService,
    private ratingService: RatingService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
    ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      

      //Hier wird die liste der berreits Kopierten Rezept geladen
      this.copiedListIds = this.tokenStorage.getUser().copiedRecipes ;
      this.copiedService.copiedRecipesIdsChanged.next(this.copiedListIds)
      
      //Hier wird die liste der berreits Bewerteten Rezept geladen
      this.ratedListIds = this.tokenStorage.getUser().ratedRecipes;
      this.ratingService.ratedRecipesIdsChanged.next(this.ratedListIds);

      //Hier wird die liste der Rezepte die sich in der toDo list befinden geladen
      this.toDoListIds = this.tokenStorage.getUser().toDoRecipeIds;
      this.recipeService.toDoIdsChanged.next(this.toDoListIds);
      // Wenn der user jetzt eingelogt ist wird er zur home umgeleitet
      this.toastService.showToast('Anmeldung erfolgreich', 'Herzlich Wilkommen'  , 'green', 5000);
      this.router.navigate(['/home'], { relativeTo: this.route });
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

      this.authService.login(username, password).subscribe({
      next: data => {
        
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        
        window.location.reload();
  
        
        
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
    
  }
}
