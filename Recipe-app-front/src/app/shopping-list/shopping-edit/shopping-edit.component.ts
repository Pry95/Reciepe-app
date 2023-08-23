//import { Component,OnDestroy,OnInit, ViewChild} from '@angular/core';
import { Ingredient } from 'src/app/Models/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Component,OnDestroy,OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f') shoppingListForm!: NgForm;
  subscription: Subscription = new Subscription;
  editMode = false;
  editedItemIndex: number = -1;
  editedItem: Ingredient = new Ingredient('', 0, '');

  constructor(private shoppingListService: ShoppingListService){}

  onAddItem(form: NgForm){
      const value = form.value;
      const newIngredient = new Ingredient(value.name,value.amount, '');
      if(this.editMode){
        this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
      }else{
        this.shoppingListService.addIngredient(newIngredient);
      }
      this.editMode = false;
      form.reset();
  }


  ngOnInit() {
    // this.subscription = this.shoppingListService.startedEditing.subscribe(
    //   (index: number) => {
    //     this.editedItemIndex = index;
    //     this.editMode = true;
    //     this.editedItem = this.shoppingListService.getIngredient(index);
    //     this.shoppingListForm.setValue({
    //       name: this.editedItem.name,
    //       amount:this.editedItem.amount
    //     })
    //   }
    // );
  }

  onClear(){
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex)
    this.onClear();
  }


  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
