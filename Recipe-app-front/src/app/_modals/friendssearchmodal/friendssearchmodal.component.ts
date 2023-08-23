import { Component } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';

@Component({
  selector: 'app-friendssearchmodal',
  templateUrl: './friendssearchmodal.component.html',
  styleUrls: ['./friendssearchmodal.component.css']
})
export class FriendssearchmodalComponent {
  constructor(protected modalService:ModalService){

  }
}
