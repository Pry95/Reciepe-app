import { Component } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
@Component({
  selector: 'app-edit-friends-modal',
  templateUrl: './edit-friends-modal.component.html',
  styleUrls: ['./edit-friends-modal.component.css']
})
export class EditFriendsModalComponent {
  constructor(protected modalService:ModalService){

  }
}
