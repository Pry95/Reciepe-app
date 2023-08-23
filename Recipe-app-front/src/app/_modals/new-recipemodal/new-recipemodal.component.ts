import { Component } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
@Component({
  selector: 'app-new-recipemodal',
  templateUrl: './new-recipemodal.component.html',
  styleUrls: ['./new-recipemodal.component.css']
})
export class NewRecipemodalComponent {
  constructor(protected modalService:ModalService){

  }
}

