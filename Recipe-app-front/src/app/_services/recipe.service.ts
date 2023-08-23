import { Injectable } from "@angular/core";
import { BehaviorSubject} from "rxjs";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Recipe } from "../Models/recipe.model";
import { Ingredient } from "../Models/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { TokenStorageService } from "./token-storage.service";
import { ActivatedRoute, Router } from '@angular/router';
import { CopiedService } from "./copied.service";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class RecipeService  {


  constructor(
    private shoppingListService: ShoppingListService,
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    private copiedService: CopiedService,
    private route: ActivatedRoute,
      private router: Router,
      private toastService: ToastService
    ) 
    {
      this.setUserIdForRecipes(this.tokenStorageService.getUserId());
     
    }
  
  private apiUrl = 'http://localhost:8080'; 
  //RezeptListen
  private recipes: Recipe[] = [];
  private publicRecipes: Recipe[] = [];
  private friendsReicpes: Recipe[] = [];

  private toDoRecipesIds: number[] = [];
  private toDoMode: boolean;
  private userId: number = this.tokenStorageService.getUserId();


  //Hier werden die eventsFür die verschiedenen Rezptlisten erstellt
  recipesChanged = new BehaviorSubject<Recipe[]>([]);
  recipesChanged$ = this.recipesChanged.asObservable();

  publicRecipesChanged = new BehaviorSubject<Recipe[]>([]);
  publicRecipessChanged$ = this.publicRecipesChanged.asObservable();

  friendsRecipesChanged = new BehaviorSubject<Recipe[]>([]);
  friendsRecipesChanged$ = this.friendsRecipesChanged.asObservable();


  toDoIdsChanged = new BehaviorSubject<number[]>([]);
  toDoIdsChanged$ = this.toDoIdsChanged.asObservable();

  toDoModeChanged = new BehaviorSubject<boolean>(false);
  toDoModeChanged$ = this.toDoModeChanged.asObservable();
  
  userIdChanged = new BehaviorSubject<number>(0);
  userIdChanged$ = this.userIdChanged.asObservable();


  //Events für boolische events
  publicModeChanged = new BehaviorSubject<boolean>(false);
  publicModeChanged$ = this.publicModeChanged.asObservable();

  //Events für id listen
  toDoRecipesIdsChanged = new BehaviorSubject<number[]>([]);
  toDoRecipesIdsChanged$ = this.toDoRecipesIdsChanged.asObservable();


  //set listen und boolische werte.
 setToDoMode(toDo: boolean){
  this.toDoMode = toDo;
  this.toDoModeChanged.next(toDo);
 }

  getPublicRecipes(){
    return this.publicRecipes
  }
  setPublicRecipes(recipes:Recipe[]){
    this.publicRecipes = recipes;
    this.publicRecipesChanged.next(recipes);
  }
  getRecipes() {
    return this.recipes;
    }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(recipes);
  }

  setFriendRecipes(recipes: Recipe[]){
    this.friendsReicpes = recipes;
    this.friendsRecipesChanged.next(recipes);
  }

  setoDoRecipesIds(ids: number[]){
    this.toDoRecipesIds = ids;
    this.toDoIdsChanged.next(ids);
  }

  

  getFriendRecipes(){
    return this.friendsReicpes
  }


  getRecipe(id: number) {
    
    return this.recipes.find(r=>r.id==id);
    }

  getUserIdForRecipes(){
    return this.userId;
  }


    //ändert die userid damit die rezepte von Freunden geladen werden
  setUserIdForRecipes(id:number){
    this.userId = id;
    this.userIdChanged.next(this.userId);
  }

  //löscht den inhalt der list für die öffentlichen rezepte
  clearPublicRecipes(){
    this.publicRecipes = [];
    this.publicRecipesChanged.next(this.publicRecipes);
    this.router.navigate(['/home'], { relativeTo: this.route });
  }

  // addIngredientsToShoppingList(ingredients: Ingredient[]) {
  //   this.shoppingListService.addIngredients(ingredients);
  //   }


  //prüft ob ein nummer in einer liste von nummern enhalten ist
  numbersInList(id:number, listOfNumbers:number[]){
    return !listOfNumbers.includes(id);

  }


  //löscht das rezept und die dazugehörigen daten anhander der rezept id
  deleteRecipe(id: number) {
    const recipe=this.recipes.find(r=>r.id===id);
    this.recipes=this.recipes.filter(r=>r.id!==id);
    this.recipesChanged.next(this.recipes);
    const result = this.http.post(`${this.apiUrl}/api/recipes/delRecipes`, {
      id,
      copied: recipe.copied
    });
    
    result.subscribe({
      //Hier muss any mitgegen werden um auf eine Variable im response reagieren zu können
      next: (response: any) => {

        const copyIds = this.copiedService.getCopiedIds();
        const newCopyIds = copyIds.filter(n => n!== response.cachedRecipeId);
        
        this.copiedService.copiedRecipesIdsChanged.next(newCopyIds);
        this.toastService.showToast('Rezept', 'Erfolgreich gelöscht !', 'green', 2000);
        this.router.navigate(['/recipes'], { relativeTo: this.route });   
        this.getToDoListFromDatabase();     
      },
      error: (error) => {
        this.recipes.push(recipe)
        this.recipesChanged.next(this.recipes);
        this.toastService.showToast('Fehler', 'Fehler beim löschen des Rezepts!: ' + error, 'red', 2000);
        this.router.navigate(['/recipes'], { relativeTo: this.route });
      }
    });
    
    
    }
  // speicher das neue Rezept in die Datenbank und ergenst es dann in der Liste
  
  saveNewRecipe(newRecipe: Recipe, userId: number, image: File) {
    console.log('neues Rezept: ', newRecipe)
    this.recipesChanged.next(this.recipes);
    //FormData wird verwendet um den ein file zu senden.
    const formData = new FormData();
    formData.append('name', newRecipe.name);
    formData.append('description', newRecipe.description);
    formData.append('visibility', newRecipe.visibility);
    formData.append('unit', newRecipe.visibility);
    formData.append('hours',  String(newRecipe.hours));
    formData.append('minutes', String(newRecipe.minutes));
    formData.append('numberOfPeople', String(newRecipe.numberOfPeople));
    formData.append('userId', String(userId));
    formData.append('image', image);
    // Konvertiere das Array von Zutaten in einen JSON-String und füge ihn zu formdata hinzu
    const ingredientsJson = JSON.stringify(newRecipe.ingredients);
    formData.append('ingredients', ingredientsJson);

    const result = this.http.post<any>(`${this.apiUrl}/api/recipes/createRecipes`, formData);
    result.subscribe({
      next: (response) => {
        
        this.recipes.push(this.convertResultToRecipe(response));       
        this.recipesChanged.next(this.recipes);   
        this.toastService.showToast('Rezept', 'Erfolgreich erstellt !', 'green', 2000);
       

      },
      error: (error) => {
        console.error('Fehler vom Server:', error);
        this.toastService.showToast('Fehler', 'Fehler beim erstellen des Rezepts!: ' + error, 'red', 2000);
      }
    });
    }


    //Hier wird das Rezept copiert und ein neues Rezept für den aktuellen Uer sertellt
    copyRecipe(recipe: Recipe){
      
      const userId = this.tokenStorageService.getUserId();  
      const dataToSend = {
        name: recipe.name,
        description: recipe.description,
        userId: userId,
        visibility: 'private',
        imagePath: recipe.imagePath,
        ingredients: recipe.ingredients,
        copied: recipe.id,
        hours: recipe.hours,
        minutes: recipe.minutes,
        numberOfPeople: recipe.numberOfPeople,
      }
        const result = this.http.post<any>(`${this.apiUrl}/api/recipes/copyRecipe`, dataToSend);
        
        result.subscribe({
          next: (response) => {           
           //Hier werden die Kopierten RezeptIds aktualisiert:
           const ids = this.copiedService.getCopiedIds()   

          //Hier wird die id zu den opierten ids Hinzugefügt
           ids.push(recipe.id)
           this.copiedService.copiedRecipesIdsChanged.next(ids)

           //Hier wird das neue Rezept zur liste hinzufügt.
           this.recipes.push(this.convertResultToRecipe(response));
           this.recipesChanged.next(this.recipes);
           this.toastService.showToast('Rezept', 'Erfolgreich kopiert !', 'green', 5000);
          },
          error: (error) => {
            console.error('Fehler vom Server:', error);
            this.toastService.showToast('Rezept', 'Fehler beim Kopieren!: ' + error, 'red', 5000);
            
            
          }
        });

    }

    

    //Löscht die Zutaten aus der Datenbank
  deleteIngredients(ids: number[]) {
    const url = 'http://localhost:8080/api/ingredients/delIngredients';

    // Übergebe die Liste der IDs an das Backend
    const data = { ids };
    //Gibt die Rückmeldung an andere Methoden weiter
    return this.http.post(url, data);
  }

      
  //akualliesiert das rezept in der Datenbank und fügt es wieder in die liste ein
  updateRecipes(recipe: Recipe, image: File) {
    console.log(recipe.ingredients)
    const rInd = this.recipes.findIndex(r => r.id == recipe.id);

    const originalRecipe = this.recipes[rInd];
    
    const formData = new FormData();
    formData.append('id', String(recipe.id));
    formData.append('name', recipe.name);
    formData.append('description', recipe.description);
    formData.append('visibility', recipe.visibility);
    formData.append('hours', String(recipe.hours));
    formData.append('minutes', String(recipe.minutes));
    formData.append('numberOfPeople', String(recipe.numberOfPeople));
  
    const ingredientsJson = JSON.stringify(recipe.ingredients);
    formData.append('ingredients', ingredientsJson);
  
    if (image) {
      formData.append('image', image);
    }
    const result = this.http.post<any>(`${this.apiUrl}/api/recipes/updateRecipes`, formData);

    result.subscribe({
      next: (response) => {
        const updatedRecipe = this.convertResultToRecipe(response);
    
        // Aktualisieren Sie die Werte des alten Rezepts mit den Werten des neuen Rezepts
        
        originalRecipe.id = updatedRecipe.id;
        originalRecipe.imagePath = updatedRecipe.imagePath;
        originalRecipe.name = updatedRecipe.name;
        originalRecipe.description = updatedRecipe.description;
        originalRecipe.visibility = updatedRecipe.visibility;
        originalRecipe.hours = updatedRecipe.hours;
        originalRecipe.minutes = updatedRecipe.minutes;
        originalRecipe.numberOfPeople = updatedRecipe.numberOfPeople;
        originalRecipe.ingredients = updatedRecipe.ingredients;
        originalRecipe.evaluation = updatedRecipe.evaluation;
    
        this.setRecipes(this.recipes);
        this.toastService.showToast('Rezept', 'Erfolgreich aktualisiert!', 'green', 2000);
      },
      error: (error) => {
        console.error('Fehler vom Server:', error);
        this.router.navigate(['/recipes'], { relativeTo: this.route });
        this.getRecipesFromDatabase(this.tokenStorageService.getUserId());
        this.toastService.showToast('Fehler', 'Fehler beim Aktualisieren des Rezepts!: ' + error, 'red', 2000);
      }
    });
  }
  
  

  //Holt die rezepte aus der datenbank
  getRecipesFromDatabase(uid:number) {
  const logtInUserId = this.tokenStorageService.getUserId();
  const response=this.http.post<any[]>(`${this.apiUrl}/api/recipes/loadRecipes`, { 
      userId: uid,
      logtInUserId: logtInUserId});
    response.subscribe({
      next: (data) => {
        const formattedRecipes = this.formatRecipesWithIngredients(data);
        const recipes = formattedRecipes;
        //Wenn die uid gleich der logtInUserId ist werden die eigenen Rezepte aktualisiert
        if(uid === logtInUserId){
          this.setRecipes(recipes)
        }else{
          //Wenn die uid ungleich der logtInUserId ist werden die freunde Rezept aktualisiert
          this.setFriendRecipes(recipes);
        }
                
      },
    });
  }

  // gibt die rezepte Direkt zurück da ich bei Recipe.detail sonst ein zeitliches problem haben und
  //die daten nicht rechtzeitig zu verfügung stehen
  returnRecipesFromDatabase(uid:number): Observable<any[]> {
        const logtInUserId = this.tokenStorageService.getUserId();
        return this.http.post<any[]>(`${this.apiUrl}/api/recipes/loadRecipes`, { 
          userId: uid,
          logtInUserId: logtInUserId
        });
      }
      
  // Giebt die öfenlichen Rezepte anhand der suchstrings zurück und befüllt dann die
  //öffenlichen rezepte
  getPublicRecipesFromDatabase(searchString: string) {    
    const dataToSend = { 
      searchString: searchString ,        
    };
    if (!searchString.trim()) {
      this.clearPublicRecipes();
      this.publicModeChanged.next(false);
      return ;
    }
    
    const result = this.http.post<any[]>(`${this.apiUrl}/api/recipes/searchPublicRecipes`, dataToSend);
    result.subscribe({
      next: (response) => {
        const formatedPublicRecipes = this.formatRecipesWithIngredients(response);
        this.publicRecipes = formatedPublicRecipes;
        this.setPublicRecipes(this.publicRecipes)
        this.publicModeChanged.next(true);
      },
      error: (error) => {
        console.error('Fehler vom Server:', error);
      }
    });     
  }

  // erstellt den Datenbankeintrag für die
  addOnToDoList(recipeId: number){

    const userId = this.tokenStorageService.getUserId();  
    const dataToSend = {
      userId,
      recipeId
    }
      this.toDoRecipesIds.push(recipeId);
      this.toDoIdsChanged.next(this.toDoRecipesIds);
      
      const result = this.http.post<any>(`${this.apiUrl}/api/todo/addTodo`, dataToSend);
      result.subscribe({
        next: (response) => {
          this.toastService.showToast('Rezept', 'Zur to-Do liste hinzgefügt!', 'green', 2000);
          console.log('Antwort vom Server:', response);
          
        },
        error: (error) => {
          console.error('Fehler vom Server:', error);
          //Fals das hinzufügen in die Tabelle nicht funkioniert wird die Id wieder aus der liste enfernt.
          this.toDoRecipesIds = this.toDoRecipesIds.filter(rId => rId !== recipeId);
          this.toDoIdsChanged.next(this.toDoRecipesIds)
          
          this.toastService.showToast(
            'Rezept', 'Fehler beim hinzufügen des Rezepts in die to_do liste!: ' + error, 'red', 2000);
        } 
      });

  }
    // gibt die ToDo liste aus der Datenbank zurück
    getToDoListFromDatabase(){
      const userId = this.tokenStorageService.getUserId();  
      const dataToSend = {
        userId,    
      }
        this.toDoIdsChanged.next(this.toDoRecipesIds);
        const result = this.http.post<any>(`${this.apiUrl}/api/todo/getTodoIds`, dataToSend);
        result.subscribe({
          next: (response) => {
            console.log(response);
            this.toDoRecipesIds=response;
            
            this.toDoIdsChanged.next(this.toDoRecipesIds);
            
          },
          error: (error) => {
            console.error('Fehler vom Server:', error);
          }
        });
    }

    //Hier wird das rezept von der ToDoListe  gelöscht.
    delRecipeFromToDoList(recipeId: number){
      const userId = this.tokenStorageService.getUserId();  
      const dataToSend = {
        userId,    
        recipeId,
      }
      this.toDoRecipesIds = this.toDoRecipesIds.filter(rId => rId !== recipeId)
      this.toDoIdsChanged.next(this.toDoRecipesIds);
     
        const result = this.http.post<any>(`${this.apiUrl}/api/todo/delTodoId`, dataToSend);
        result.subscribe({
          next: (response) => {
            this.toastService.showToast('Rezept', 'Rezept aus der  to-Do liste entfernt!', 'green', 2000);
            if(this.toDoMode){
              this.router.navigate(['/recipes'], { relativeTo: this.route });
            }
          },
          error: (error) => {
            console.error('Fehler vom Server:', error);
            this.toDoRecipesIds.push(recipeId)
            this.toDoIdsChanged.next(this.toDoRecipesIds);
            this.toastService.showToast(
              'Rezept', 'Fehler beim entfernen des Rezepts aus der to_do liste!: ' + error, 'red', 2000);
          } 
          
        });
    }



  //Hier werden die Rezepte die aus der Datenbank kommen in die richten Datentypen convertiert
  formatRecipesWithIngredients(recipesWithIngredients: any[]): Recipe[] {
    return recipesWithIngredients.map((recipeWithIngredients) => {
    const { 
      id, 
      name, 
      description, 
      imagePath,
      visibility, 
      ingredients,
      copied,
      evaluation,
      hours,
      minutes,
      numberOfPeople 
    } = recipeWithIngredients;

    const formattedIngredients: Ingredient[] = ingredients.map((ingredient) => {
    return new Ingredient(ingredient.name, ingredient.amount,ingredient.unit,ingredient.id);
  	});

    return new Recipe(
      id,
      name,
      description,
      imagePath,
      visibility,
      formattedIngredients,
      hours,minutes,
      numberOfPeople,
      copied,
      evaluation
    );
    });
  }
  //Hier wird das Rezept das Erstellt oder Bearbeitet wurde und
    // vom Backend zurückgegben wird in Recipe convertiert
    convertResultToRecipe(result: any): Recipe {
      console.log( result)
      const recipeId = result.id;
      const recipeName = result.name;
      const recipeDesc = result.description;
      const recipeVisibility = result.visibility;
      const recipeImagePath = result.imagePath;
      const recipeCopied = result.copied;
      const recipeEvaluation = result.evaluation;
      const recipeHours = result.hours;
      const recipeMinute = result.minutes;
      const recipeNumberOfPeople = result.numberOfPeople;
      const recipeIngredients = Array.isArray(result.ingredients) ? this.convertToIngredientsArray(result.ingredients) : [];

      const recipe = new Recipe(
        recipeId, 
        recipeName, 
        recipeDesc, 
        recipeImagePath,
        recipeVisibility, 
        recipeIngredients,
        recipeHours,
        recipeMinute, 
        recipeNumberOfPeople,
        recipeCopied,
        recipeEvaluation
        
        );
        console.log(recipe)
      return recipe;
    }
      
    //Hier werden die dazupassenden Zutaten in Ingredients cnvertiert
    convertToIngredientsArray(ingredients: any[]): Ingredient[] {
      const ingredientObjects: Ingredient[] = [];
    
      for (const ingredient of ingredients) {
        const iingredientName = ingredient.name;
        const ingredientAmount = ingredient.amount;
        const ingredientUnit = ingredient.unit;
        const ingredientId = ingredient.id;

        const ingredientObject = new Ingredient(iingredientName,ingredientAmount,ingredientUnit,ingredientId)
        ingredientObjects.push(ingredientObject);
      }
    
      return ingredientObjects;
    }
}
