import { Component, Input } from '@angular/core';
import { Friend } from 'src/app/Models/friend.model';

@Component({
  selector: 'app-friends-list-item',
  templateUrl: './friends-list-item.component.html',
  styleUrls: ['./friends-list-item.component.css']
})
export class FriendsListItemComponent {
@Input() friend:Friend;

}
