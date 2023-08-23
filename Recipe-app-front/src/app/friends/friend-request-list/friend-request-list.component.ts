import { Component, OnInit } from '@angular/core';
import { FriendRequest } from 'src/app/Models/friendRequest.model';
import { FriendsService } from 'src/app/_services/friens.service';

@Component({
  selector: 'app-friend-request-list',
  templateUrl: './friend-request-list.component.html',
  styleUrls: ['./friend-request-list.component.css']
})
export class FriendRequestListComponent implements OnInit {
  constructor(
    private friendService: FriendsService
  ){
    
  }
  friendRequests: FriendRequest[] = [];
  ngOnInit(): void {
    this.friendRequests = this.friendService.getFriendsRequests();
    this.friendService.friendRequestChanged.subscribe(friendRequests => {
      this.friendRequests = friendRequests.map((friendRequests) => ({ ...friendRequests }));
    });
  }


  //Hier werden die Freundschaftanfragen versendet
  sendFriendRequest(friendRequest:FriendRequest,answer:boolean){
    this.friendService.answerFriendRequest(friendRequest,answer)
  }
}
