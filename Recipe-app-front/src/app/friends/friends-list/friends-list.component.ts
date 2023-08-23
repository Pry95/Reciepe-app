import { Component, OnInit,Input } from '@angular/core';
import { Recipe } from 'src/app/Models/recipe.model';
import { Router } from '@angular/router';


import { Friend } from 'src/app/Models/friend.model';
import { FriendsService } from 'src/app/_services/friens.service';
import { RecipeService } from 'src/app/_services/recipe.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';


@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
  
})

export class FriendsListComponent implements OnInit {
  //Der input bestimmt ob die freunde ausgewält oder bearbeitet werden
  @Input() editMode: boolean ;
  
  activeFriend = null;
  isFriendActive = false
  friends: Friend[] = [];
  recipes: Recipe[] = [];
  userId: number = this.recipeService.getUserIdForRecipes();
  

  

  constructor(
    private friendService: FriendsService,
    private recipeService: RecipeService,
    private tokenStroageService: TokenStorageService,
    
    
    private router: Router

  ){}

  
  //Hier wird 
  setActiveFriend(friend: Friend) {
    this.activeFriend = friend;
    this.isFriendActive = true;
    this.userId = this.activeFriend.id;
    //Jetzt wird die aktulle userId durch die des ankelickten freundes ersetzt
    this.recipeService.setUserIdForRecipes(this.userId)
    //ToDo mode wird auf false gesetzt
    this.recipeService.toDoModeChanged.next(false);
    this.router.navigate(['/recipes'], { relativeTo: null }); 
    this.friendService.friendModeChanged.next(true);
    

}

// getActiveFriend(){
  
// }

// Diese Methode entfernt den aktiven Freund und aktualisiert den booleschen Wert
removeActiveFriend() {
    this.activeFriend = null;
    this.isFriendActive = false;
    this.recipeService.userIdChanged.next(this.tokenStroageService.getUserId());
    this.recipeService.setUserIdForRecipes(this.tokenStroageService.getUserId())
    this.friendService.friendModeChanged.next(false);
    this.router.navigate(['/recipes'], { relativeTo: null });
    
}
 
  ngOnInit(): void {
    //Freunde werden aus der geladen
    this.friendService.getFriendsFromDatabase();
    //Hier werden die Freunde jetzt im FriendService verändert und hier wird auf die änderung reagiert
    this.friendService.friendsChanged.subscribe(friends => {
    this.friends = friends.map((friends) => ({ ...friends }));
    //ist nur eine basicherung fals beim abonieren der Freundesliste ein fehler auftritt
    this.friends = this.friendService.getFriends();
    
    
    });
    //Hier wird der friendMode aboniert
    this.friendService.friendModeChanged.subscribe(isFriendMode => {
      this.isFriendActive = isFriendMode;
      });
  }

  //Hier wird der Freund aus der FreundesListe Gelöscht
  onDelFriend(friendId:number){
    this.friendService.delFriendShip(friendId)
  }

}
