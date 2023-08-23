import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { FriendsService } from './_services/friens.service';
import { FriendRequest } from './Models/friendRequest.model';
import { ModalService } from './_services/modal.service';
import { RecipeService } from './_services/recipe.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  roles: string[] = [];
  isLoggedIn = false;

  username?: string;
  userImagePath:string;
  altImage: string = ""
  numberOfFriendReques:number = 0;
  friendRequests: FriendRequest[] = [];

  constructor(
    private tokenStorageService: TokenStorageService,
    private friendsService: FriendsService,
    private recipeService:RecipeService,
    protected modalService:ModalService,
    protected frienService: FriendsService,
    ) { }

  ngOnInit(): void {
    this.frienService.setFriendMode(true)
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;      
      this.userImagePath = user.image;   
      this.username = user.username;
      this.friendRequests = this.friendsService.getFriendsRequests();
      this.friendsService.friendRequestChanged.subscribe(friendRequests => {
      this.friendRequests = friendRequests.map((friendRequests, index) => ({ ...friendRequests, adjustedIndex: index + 1 }));
    });
    }
    if(this.isLoggedIn){
      //Hier werden alle 5 sec die Freundschaftanfragen und die Freunde abgefragt
      setInterval(() => {
        this.friendsService.getFriendRequest();
        this.friendsService.getFriendsFromDatabase();
      }, 5000);
    }
    
  }
 //Hier wird der User augelogt
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
  //Hier gehts zum Rezeptbuch
  onRecipes(){
    this.frienService.friendModeChanged.next(false);
    this.recipeService.publicModeChanged.next(false);
    console.log('falsch')
  }

}
