import { Component } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';

@Component({
  selector: 'app-friendsrequestmodal',
  templateUrl: './friendsrequestmodal.component.html',
  styleUrls: ['./friendsrequestmodal.component.css']
})
export class FriendsrequestmodalComponent {

  constructor(protected modalService:ModalService){

  }
}
