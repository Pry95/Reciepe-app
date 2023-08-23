import { Component, Input } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { RatingService } from 'src/app/_services/rating.serive';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.css']
})
export class RatingModalComponent {
  @Input() recipeId: number ;

  constructor(protected modalService:ModalService,
    protected ratingService: RatingService){

  }
}
