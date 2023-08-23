
import { Injectable } from "@angular/core";
import { BehaviorSubject} from "rxjs";
import { HttpClient} from "@angular/common/http";

import { TokenStorageService } from "./token-storage.service";
import { ToastService } from "./toast.service";
import { RecipeService } from "./recipe.service";
@Injectable()
export class RatingService{

  constructor(
      protected tokenStorageService: TokenStorageService,
      private http: HttpClient,
      private toastService: ToastService,
      private recipeService: RecipeService,
    ){}

    private apiUrl = 'http://localhost:8080'; 
    ratedIds: number[] = [];

    //event und die änderung der RatedIds für andere componenten sichtbar zu machen
    ratedRecipesIdsChanged = new BehaviorSubject<number[]>([]);
    ratedRecipesIdsChanged$ = this.ratedRecipesIdsChanged.asObservable();


  
  setRatedIds(ids: number[]){
    this.ratedIds = ids;
    this.ratedRecipesIdsChanged.next(this.ratedIds);

  }

  onRated(recipeId: number, rating: number) {
    
    const userId = this.tokenStorageService.getUserId();
    
    const result = this.http.post<any[]>(`${this.apiUrl}/api/rated/rate`, { 
        userId: userId,
        recipeId: recipeId,
        rating: rating
    });

    result.subscribe({
      next: (response: any) => {
          console.log('Antwort vom Server:', response); 
          this.ratedIds.push(recipeId);
          this.ratedRecipesIdsChanged.next(this.ratedIds)
          this.toastService.showToast('Rezept', 'Erfolgreich bewertet!', 'green', 2000);

          //Hier wird geprüft in welcher Liste sich das Bewerete Rezept befindet
          const myRecipes = this.recipeService.getRecipes()
          const myRecipesIndex = myRecipes.findIndex(r => r.id == recipeId);

          const publicRecipes = this.recipeService.getPublicRecipes();
          const publicReicpesIndex = publicRecipes.findIndex(r => r.id == recipeId);

          const friendRecipes = this.recipeService.getFriendRecipes();
          console.log(friendRecipes)
          const friendReicpesIndex = friendRecipes.findIndex(r => r.id == recipeId);
          console.log(friendReicpesIndex)

          //Wenn es in den eingenen Rezepten ist wird die bewertung des rezepts angepasst und die userRezepte aktualisiert:
          if(myRecipesIndex !== -1 && friendReicpesIndex === -1){
            console.log('1')
            const originalRecipe = myRecipes[myRecipesIndex];
            originalRecipe.evaluation = response.averageRating
            console.log(myRecipes)
            this.recipeService.setRecipes(myRecipes);

            //Wenn es in den öffenlichen Rezepten ist wird die bewertung des rezepts angepasst und die öffentlichenRezepte aktualisiert:
          }else if(myRecipesIndex === -1 && publicReicpesIndex !==-1){

            console.log('2')
            const originalRecipe = publicRecipes[publicReicpesIndex];
            originalRecipe.evaluation = response.averageRating
            this.recipeService.setPublicRecipes(publicRecipes);

            //Wenn es in den  Rezepten von freunden ist wird die bewertung des rezepts angepasst und die freundeRezepte aktualisiert:
          }else if(friendReicpesIndex !== -1){

            console.log('3')
            console.log(friendRecipes)
            console.log(friendReicpesIndex)
            const originalRecipe = friendRecipes[friendReicpesIndex];
            originalRecipe.evaluation = response.averageRating
            this.recipeService.setFriendRecipes(friendRecipes);
          }
      },
      error: (error) => {
          console.error('Fehler vom Server:', error);
          this.toastService.showToast('Fehler', 'Behler beim bewerten aufgetreten!: ' + error, 'red', 2000);
      }
    });
  }
  //Hier werden die Ids geladen die der User bereits bewerted hat
  getRatingsFromDatabase() {
    const userId = this.tokenStorageService.getUserId();
    const result = this.http.post<any[]>(`${this.apiUrl}/api/rated/relodeRatings`, { 
        userId: userId,
    });

    result.subscribe({
      next: (response: any) => {
          console.log('Antwort vom Server:', response);     
         this.ratedIds = response.ratedRecipeIds;
          this.ratedRecipesIdsChanged.next(this.ratedIds)  
      },
      error: (error) => {
          console.error('Fehler vom Server:', error);
      }
  });
  }
  
}  