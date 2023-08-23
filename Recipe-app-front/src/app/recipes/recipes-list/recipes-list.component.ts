import { Component, OnInit, Input } from '@angular/core';

import { Recipe } from '../../Models/recipe.model';
import { RecipeService } from '../../_services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { FriendsService } from 'src/app/_services/friens.service';
import { ModalService } from 'src/app/_services/modal.service';


@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})

export class RecipesListComponent implements OnInit {
  @Input() recipes: Recipe[];
  friendRecipes: Recipe[];
  friendMode: boolean;
  subscription: Subscription = new Subscription();
  userId: number = this.recipeService.getUserIdForRecipes();
  friendId: number;
  toDoMode: boolean = false;
  toDoIds: number[] = [];

  constructor(
    private recipeService: RecipeService,
    private friendService: FriendsService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    protected modalService: ModalService,
  
  ) {}

    //Hier werden die Rezept anhand er ToDoListe gefilter wenn ToDoMode === true
  recipesByToDoMode(){
    if (this.toDoMode) { 
      const filteredRecipes = this.recipes.filter(recipe => this.toDoIds.includes(recipe.id));
      this.recipes = filteredRecipes.map((recipe) => ({ ...recipe }));
    } else {
      this.recipes = this.recipes.map((recipe) => ({ ...recipe }));
    }
  }


  ngOnInit() {

    //Wenn ich die Rezpte ändern wird dieser code ausgeführt
    this.recipeService.recipesChanged.subscribe(recipes => {
      this.recipes=recipes;
      this.recipesByToDoMode();
    });
    //Hier wird die änderung der friendRecipes aboniert
    this.recipeService.friendsRecipesChanged.subscribe(recipes => {
      this.friendRecipes = recipes.map((recipe) => ({ ...recipe}));
    });

    //Hier wird der friendMode aboniert
    this.friendService.friendModeChanged.subscribe(isFriendMode => {
      this.friendMode = isFriendMode;
    });

    //Hier wird der toDoMode aboniert und wenn er true ist werden die gefilterten rezepte zurückgegeben
    this.recipeService.toDoModeChanged.subscribe(isToDoMode => {
      this.toDoMode = isToDoMode;
      this.recipesByToDoMode();
    });

    //Hier werden die toDoIds aboniert
    this.recipeService.toDoIdsChanged.subscribe(toDos => {
      this.toDoIds = toDos.map(id => id);
    });

    //Hier wird darauf reagiert das die Userid sich geändert hat und jetzt werden die rezepte anhand dieser Id geladen
    this.recipeService.userIdChanged$.subscribe(uid => {
      this.recipeService.getRecipesFromDatabase(uid);
      if (this.toDoIds.length == 0) {
        this.recipeService.getToDoListFromDatabase();
      }
    })
  }

  //Hier werden die Rezpte für den Eingelogten user Zurückgegeben
  getMyRecipes() {
    this.recipeService.setToDoMode(false)
    this.recipeService.getRecipesFromDatabase(this.tokenStorageService.getUserId());
  }

  //Ändert den status des friendmode wenn er true ist und naviegiert zu recipes
  getToDoRecipes() {
    this.recipeService.setToDoMode(true)
    if (this.friendMode) {
      this.friendService.friendModeChanged.next(false);
    }
    this.toDoMode = true;
    this.router.navigate(['/recipes'], { relativeTo: this.route });
  }
}
