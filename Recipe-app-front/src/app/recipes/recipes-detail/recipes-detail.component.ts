import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../../Models/recipe.model';
import { RecipeService } from '../../_services/recipe.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { FriendsService } from 'src/app/_services/friens.service';
import { CopiedService } from 'src/app/_services/copied.service';
import { ModalService } from 'src/app/_services/modal.service';
import { RatingService } from 'src/app/_services/rating.serive';


@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.css']
})
export class RecipesDetailComponent implements OnInit, OnDestroy {
  
  constructor(
    protected recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    protected copiedService: CopiedService,
    private friendService: FriendsService,
    protected modalService: ModalService,
    private ratingService: RatingService,
    
   
  ) { }


  private recipesChangedSubscription: Subscription;

  recipes: Recipe[] = [];
  friendRecipes: Recipe[] = [];
  publicRecipes: Recipe[] = [];
  ingredientString: string = 'Zutat: ';
  numberString: string = 'Anzahl: ';
  unitString: string = 'Einheit: ';
  recipe: Recipe = new Recipe();
  id: number;
  isLoggedIn: boolean;
  friendMode: boolean ;
  publicMode: boolean;
  toDoMode: boolean;

 
  copiedIds: number[] = [];
  starRating = 0;
  myRating: number = 0;
  ratingIds: number[] = [];
  toDoIds: number[] = [];
  role: string;
  
  
  ngOnInit(): void {

    this.friendMode = false;
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.role = this.tokenStorageService.getPrimaryUserRole();


    // hier werden die änderunge der rezeptListe aboniert
    this.recipeService.recipesChanged.subscribe(recipes => {
      this.recipes = recipes.map((recipe) => ({ ...recipe }));
      this.upDateMyRecipe()
    });

    // hier werden die änderunge der öffenlichen rezeptListe aboniert
    this.recipeService.publicRecipesChanged.subscribe(recipes => {
      this.publicRecipes = recipes.map((recipe) => ({ ...recipe}));
      this.upDatePublicRecipes();
    });

    

    //Aktuallisiert den freindMode
    this.friendService.friendModeChanged.subscribe(isFriendMode => {
      this.friendMode = isFriendMode;
    });
    //Aktuallisiert den PublicMode
    this.recipeService.publicModeChanged.subscribe(isPublicMode => {
      this.publicMode = isPublicMode;    
    });

    //Aktuallisiert den ToDoMode
    this.recipeService.toDoModeChanged.subscribe(isTodoMode => {
      this.toDoMode = isTodoMode;
      
    });

    //Aktuallisiert die Copierten ids
    this.copiedService.copiedRecipesIdsChanged.subscribe(copiedIds => {
      this.copiedIds = copiedIds.map(id => id)
    });
    //Akutalisiert die Dodo ids
    this.recipeService.toDoIdsChanged.subscribe(toDos => {
      // wenn der toDoMode true ist werden nur die rezepte zurückgegeben die in der ToDo liste sind
      if(this.toDoMode){
        const filteredRecipes = this.recipes.filter(recipe => this.toDoIds.includes(recipe.id));
        this.recipeService.recipesChanged.next(filteredRecipes)
        this.recipe = filteredRecipes.find((r, i) => r.id == this.id);
      }
      this.toDoIds = toDos.map(id => id)
    });

    //Aktuallisiert die Bewerted ids
    this.ratingService.ratedRecipesIdsChanged .subscribe(ratedIds => {
      this.ratingIds = ratedIds.map(id => id )
      
    });
    //Hier werden die änderungen der FreundesRezepte aboniert
    this.recipeService.friendsRecipesChanged.subscribe(recipes => {
      this.friendRecipes = recipes.map((recipe) => ({ ...recipe}));
      this.upDateFriendReicpes();
      
    });
    console.log('fruendesRezepte',this.friendRecipes)

    //Fals die Seite refresht wird müssen die listen neu abefragt werden
    if(this.copiedIds.length === 0){
      this.copiedService.getCopyIdsFromDatabase() ;  
    }
    if(this.ratingIds.length === 0){
      this.ratingService.getRatingsFromDatabase();
    }
    if(this.toDoIds.length === 0){
       this.recipeService.getToDoListFromDatabase();
    }
    
    this.recipeService.getRecipesFromDatabase(this.tokenStorageService.getUserId())

  
    //Hier werden die Rezepte direkt zurückgegeben da sie sonst zu spät ankommen
    //Hier wird das Rezept ausgewält
    this.recipeService.returnRecipesFromDatabase(this.tokenStorageService.getUserId()).subscribe(recipes => {
      this.recipes = recipes.map((recipe) => ({ ...recipe}));
      this.route.params.subscribe((params: Params) => {    
        this.id = +params['index'];
  
        if (this.id !== undefined && !this.publicMode ) {

          if(this.toDoMode){
            //Hier werden die rezepte gefilter falls der ToDo mode akiviert ist
            const filteredRecipes = this.recipes.filter(recipe => this.toDoIds.includes(recipe.id));
            this.recipe = filteredRecipes.find((r) => r.id == this.id);
          }else{
            this.recipe = this.recipes.find((r) => r.id == this.id);
          }
          if(this.friendMode){
            this.recipe = this.friendRecipes.find((r) => r.id === this.id);
          }
        } else if(this.publicMode) {
          const publicRecipes = this.recipeService.getPublicRecipes();
          this.recipe = publicRecipes.find((r) => r.id === this.id);
        }
      });
    });
    
  }

  ngOnDestroy(): void {
    if (this.recipesChangedSubscription) {
      this.recipesChangedSubscription.unsubscribe();
    }
  }
  formatTime(number: number): string {
    return ('0' + number).slice(-2);
  }



  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  getFormattedDescription(): string {
    return this.recipe.description.replace(/\n/g, '<br>');
  }
  upDateMyRecipe(){
    if (this.recipe && this.recipe.id && !this.publicMode && !this.friendMode) {
      const updatedRecipe = this.recipes.find(r => r.id === this.recipe.id);
      if (updatedRecipe) {
        // Aktualisieren Sie das aktuelle Rezept mit den neuen Daten
        this.recipe = updatedRecipe;
      }
    }
    
  }
  upDatePublicRecipes(){
    if(this.recipe && this.recipe.id && this.publicMode && !this.friendMode){
      const updatedRecipe = this.publicRecipes.find(r => r.id === this.recipe.id);
      if (updatedRecipe) {
        // Aktualisieren Sie das aktuelle Rezept mit den neuen Daten
        this.recipe = updatedRecipe;
      }

    }
  }

  upDateFriendReicpes(){
    if(this.friendMode){
      console.log(this.friendRecipes)
      const updatedRecipe = this.friendRecipes.find(r => r.id === this.recipe.id);
      if (updatedRecipe) {
        // Aktualisieren Sie das aktuelle Rezept mit den neuen Daten
        this.recipe = updatedRecipe;
      }

    }
  }
}