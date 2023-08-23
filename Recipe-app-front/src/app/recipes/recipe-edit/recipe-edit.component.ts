import { Component, OnInit } from '@angular/core';
import { UntypedFormArray,FormGroup,FormBuilder, UntypedFormControl, UntypedFormGroup, Validators,FormArray } from '@angular/forms';
import { ActivatedRoute,Params,Router } from '@angular/router';


import { RecipeService } from '../../_services/recipe.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service'; 
import { Recipe } from '../../Models/recipe.model';
import { Ingredient } from 'src/app/Models/ingredient.model';
import { ModalService } from 'src/app/_services/modal.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  selectedVisibility: string = 'private';

  index: number;
  editMode = false;
  recipeForm: UntypedFormGroup ;
  recipe: Recipe = new Recipe();
  recipes: Recipe[] = [];
  delList: number[] = [];
  imageUrl: string;
  selectedImag :File;
  role = this.tokenStorageServide.getPrimaryUserRole();
  unitOptions = ['g', 'ml', 'Kg', 'Stk.', 'Pk'];
  hours: number = 0;
  minutes: number = 0;
  persons: number = 0;
  newIngredient: Ingredient;
  updatedIngredients: Ingredient[];
  
  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router,
              private tokenStorageServide: TokenStorageService,
              protected modalService:ModalService,
              private fb: FormBuilder,
              
              ){}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.index = params['index'];
      //wenn der index nicht null ist wird ein Rezept beareitet sonst wird eine Neues erzeugt.
      this.editMode = params['index'] != null;
      this.initForm();
      });
  }
  

  
  onCancel(){
    //initForm wird zurückgesetz weil in dem modal die einzelnen werte gespeichert werden
    this.initForm();
    this.imageUrl = ""
    this.modalService.close();
    // Die route soll nur gewelchselt werden wenn ein Rezept ertellt wird und nicht wenn es bearbeitet wird
    if(this.editMode){
      this.router.navigate(['../'],{relativeTo: this.route})
    }
    
  }
  //Hier wird eine neue Form für die Zutaten hinzugefügt
  onAddIngredient(){
    (<UntypedFormArray>this.recipeForm.get('ingredients')).push(
      new UntypedFormGroup({
        'name': new UntypedFormControl(),
        'amount': new UntypedFormControl(null,[
          Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)
        ]),
        'unit': new UntypedFormControl(),
      })
    )
  }

  onDeleteIngredient(index: number){
    
    const formIngredient = this.recipeForm.value.ingredients[index];
    if (formIngredient.id) {
      //Hier werden die Ids der Zutaten in die delList gespeichert und anschließend die From zerstört
      //Dies passiert aber nur wenn die Zutaten bereits eine Id haben
      this.delList.push(formIngredient.id);
      (<UntypedFormArray>this.recipeForm.get('ingredients')).removeAt(index);
    
    } else {
        //Hier wird nur dei Form mit den Inhalt zerstört
        (<UntypedFormArray>this.recipeForm.get('ingredients')).removeAt(index);
    }
  }

  // Diese Methode wird aufgerufen, wenn der Benutzer eine Maßeinheit für eine Zutat auswählt.
  selectUnit(i: number, unit: string) {
    // Zugriff auf das FormArray "ingredients" im Hauptformular "recipeForm".
    const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
    // Zugriff auf das FormGroup, das die ausgewählte Zutat repräsentiert.
    const ingredientGroup = ingredientsArray.at(i) as FormGroup;
    // Zugriff auf das Form Control "unit" innerhalb des ausgewählten FormGroup.
    const unitControl = ingredientGroup.get('unit');
    // Überprüfen, ob das Form Control für die Maßeinheit existiert.
    if (unitControl) {
        // Setze den Wert des Form Controls auf die ausgewählte Maßeinheit.
        unitControl.setValue(unit);
    }
  }

  onSubmit(){
    if(this.editMode){
      //Jetzt das Rezept geupdatet
      this.onUpdateRecipeDatabase();
    }else{
      //Jetzt wird ein neues rezept in die datenbank gespeichert
      this.onWriteRecipeDatabese();
      // this.modalService.close();
      
    }
    this.onCancel();
  }

  // Diese Methode wird aufgerufen, wenn der Benutzer eine Bild auswählt.
  onFileSelected(event: any) {
  // Das ausgewählte Bild wird in der Variable "selectedImag" gespeichert.
  this.selectedImag = event.target.files[0];
  // Überprüfen, ob ein Bild ausgewählt wurde.
  if (this.selectedImag) {
      // Ein FileReader wird erstellt, um das ausgewählte Bild zu lesen.
      const reader = new FileReader();
      // Die "onload"-Funktion wird definiert, um aufgerufen zu werden, wenn das Bild geladen ist.
      reader.onload = () => {
          // Die geladene Bild-URL wird der Variable "imageUrl" zugewiesen.
          // "reader.result" enthält die Daten des geladenen Bildes als Base64-codierte Zeichenkette.
          this.imageUrl = reader.result as string;
      };
      // Das ausgewählte Bild wird vom FileReader gelesen und in Base64 konvertiert.
      reader.readAsDataURL(this.selectedImag);
  }
}
  //Hier wird die Form initialiesiert
  private initForm(): void {
    let recipeId = 0;
    let recipeName = '';
    let recipeDescription = '';
    let recipeVisibility = 'private';
    let recipeIngredients = new UntypedFormArray([]);
    let imageFile: File | null = null;
    let hoursValue = 0;
    let minutesValue = 0;
    let peopleValue = 0;
  
    if (this.editMode) {
      //Wenn der bearbeitungsmodus aktiviert ist wird das rezept in die vorm geladen
      this.recipe = this.recipeService.getRecipe(this.index);
      recipeId = this.recipe.id;
      recipeName = this.recipe.name;
      recipeDescription = this.recipe.description;
      recipeVisibility = this.recipe.visibility || 'private';
      hoursValue = this.recipe.hours;
      minutesValue = this.recipe.minutes;
      peopleValue = this.recipe.numberOfPeople
  
      
      //Wenn das Rezept Zutaten enthält wird jetzt für jede eine Formgroup erstellt
      if (this.recipe.ingredients) {
        for (let ingredient of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              id: new UntypedFormControl(ingredient.id),
              name: new UntypedFormControl(ingredient.name, Validators.required),
              amount: new UntypedFormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
              unit: new UntypedFormControl(ingredient.unit),
            })
          );
        }
      }
    }
    //Hier wird jetzt der Inhalt der Formgroup in die recipeForm geladen
    this.recipeForm = this.fb.group({
    id: new UntypedFormControl(recipeId),
    name: new UntypedFormControl(recipeName, Validators.required),
    description: new UntypedFormControl(recipeDescription, Validators.required),
    visibility: new UntypedFormControl(recipeVisibility, Validators.required),
    ingredients: recipeIngredients,
    image: new UntypedFormControl(imageFile),
    hours: new UntypedFormControl(hoursValue, Validators.required),
    minutes: new UntypedFormControl(minutesValue, Validators.required),
    numberOfPeople: new UntypedFormControl(peopleValue, Validators.required)
  });
}
  

get controls() {
  // Zugriff auf das FormArray "ingredients" im Hauptformular "recipeForm".
  return (<UntypedFormArray>this.recipeForm.get('ingredients')).controls;
}

 
  //Rezept wird in die Datenbak geschrieben
  onWriteRecipeDatabese() {
    this.recipeService.saveNewRecipe(this.recipeForm.value, this.tokenStorageServide.getUserId(), this.selectedImag); 
  }
 

  
  //Rezept wird in der datenbank aktualisiert.
  onUpdateRecipeDatabase() {
    // Hier werden die Ids der Zutaten, die gelöscht werden sollen, ans Backend gesendet
    if (this.delList.length > 0) {
      this.recipeService.deleteIngredients(this.delList).subscribe({
        next: (response) => {
          console.log('Ingredients deleted successfully:', response);
          this.delList = [];
        },
        error: (error) => {
          console.error('Error deleting ingredients:', error);
          // Hier kannst du Fehlerbehandlung durchführen, falls das Löschen der Zutaten fehlschlägt
        },
      });
    }
  
    // Hier übernehme die Werte aus der Form in das recipe-Objekt
    this.recipe.name = this.recipeForm.value.name;
    this.recipe.description = this.recipeForm.value.description;
    this.recipe.imagePath = this.recipeForm.value.imagePath;
    this.recipe.visibility = this.recipeForm.value.visibility;
    this.recipe.hours = this.recipeForm.value.hours;
    this.recipe.minutes = this.recipeForm.value.minutes;
    this.recipe.numberOfPeople = this.recipeForm.value.numberOfPeople;
  
    // Erstelle eine Kopie der Zutatenliste
    this.updatedIngredients = [...this.recipe.ingredients];
  
    // Iteriere über die Zutaten aus der Form
    this.recipeForm.value.ingredients.forEach((formIngredient) => {
      // Überprüfe, ob die Zutat bereits eine ID hat
      const existingIngredientIndex = this.recipe.ingredients.findIndex(
        (ingredient) => ingredient.id === formIngredient.id
      );
  
      if (existingIngredientIndex !== -1) {
        // Aktualisiere die Zutat mit den Werten aus der Form
        const existingIngredient = { ...this.recipe.ingredients[existingIngredientIndex] };
        existingIngredient.name = formIngredient.name;
        existingIngredient.amount = formIngredient.amount;
        existingIngredient.unit = formIngredient.unit;

        // Aktualisiere die Zutat in der aktualisierten Liste
        this.updatedIngredients[existingIngredientIndex] = existingIngredient;
      } else if (!formIngredient.id) {
        // Füge eine neue Zutat hinzu (ohne ID)
        this.newIngredient = new Ingredient(formIngredient.name, formIngredient.amount, formIngredient.unit);
        this.updatedIngredients.push(this.newIngredient);
      }
    });
    // Entferne nicht mehr vorhandene Zutaten aus dem Rezept
    this.recipe.ingredients = [...this.updatedIngredients];
  
    // Füge eine Verzögerung hinzu 
    setTimeout(() => {
      // Rufe die Update-Methode des Rezeptdienstes auf
      console.log(this.recipe);
      this.recipeService.updateRecipes(this.recipe, this.selectedImag);
    }, 100); // Hier kannst du die Verzögerungszeit in Millisekunden einstellen
  }
  
};
