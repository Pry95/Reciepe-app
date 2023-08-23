import { Component, OnInit } from '@angular/core';
import { ModalService } from '../_services/modal.service';
import { FriendsService } from '../_services/friens.service';
import { RecipeService } from '../_services/recipe.service';
import { Recipe } from '../Models/recipe.model';




@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
  
})

export class RecipesComponent implements OnInit {

 


  constructor(
    protected modalService:ModalService,
    private friendService: FriendsService,
    
     ){
  }
  
  ngOnInit() {  
    
  this.friendService.friendModeChanged.next(false)
  }
}
