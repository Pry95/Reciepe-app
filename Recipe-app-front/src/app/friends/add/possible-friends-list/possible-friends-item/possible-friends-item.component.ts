import { Component,Input } from '@angular/core';
import { Friend } from 'src/app/Models/friend.model';

@Component({
  selector: 'app-possible-friends-item',
  templateUrl: './possible-friends-item.component.html',
  styleUrls: ['./possible-friends-item.component.css']
})
export class PossibleFriendsItemComponent {
  @Input() friend: Friend;

}
