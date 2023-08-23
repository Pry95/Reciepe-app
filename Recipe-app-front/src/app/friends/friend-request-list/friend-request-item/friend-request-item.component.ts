import { Component, Input } from '@angular/core';
import { FriendRequest } from 'src/app/Models/friendRequest.model';

@Component({
  selector: 'app-friend-request-item',
  templateUrl: './friend-request-item.component.html',
  styleUrls: ['./friend-request-item.component.css']
})
export class FriendRequestItemComponent {
@Input() friendRequest :FriendRequest;
}
