import { Component } from '@angular/core';
import { FriendsService } from 'src/app/_services/friens.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
  

})
export class AddComponent {
  
  inputValue: string ='' ;
  
  constructor(private friendsService: FriendsService){}

  //Bei jeder veränderung wird im inputFeld wird die Mehode ausgelöst und es werden die Möglichen Freunde zurückgegeben
  searchPossibleFriends() {
    this.friendsService.searchFriends(this.inputValue) 
  }
}
    
  

  
  

