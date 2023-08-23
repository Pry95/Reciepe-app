import { Component , OnInit} from '@angular/core';
import { Friend } from 'src/app/Models/friend.model';
import { FriendsService } from 'src/app/_services/friens.service';



@Component({
  selector: 'app-possible-friends-list',
  templateUrl: './possible-friends-list.component.html',
  styleUrls: ['./possible-friends-list.component.css']
})
export class PossibleFriendsListComponent implements OnInit  {
possibleFriends : Friend[];

constructor(private friendsService : FriendsService){}


ngOnInit(): void {
  this.friendsService.possibleFriendsChanged$.subscribe((updatedFriends) => {
    this.possibleFriends = updatedFriends;
  });
  this.possibleFriends = this.friendsService.getPossibleFriends();
}




//Hier wird die Freundschaftsanfrage versendet.
onFriendRequest(id:number){
  this.friendsService.sendFriendRequest(id);
}
}
