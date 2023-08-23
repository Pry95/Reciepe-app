import { Component, OnInit,  Input, } from '@angular/core';
import { RatingService } from '../_services/rating.serive';
import { ModalService } from '../_services/modal.service';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnInit {
  @Input() recipeId: number = 0;
  @Input() rating: number = 0;
  @Input() rate: boolean = false;
 

  maxRating = 5;
  starIndexes: number[] = [];

  constructor(protected ratingService: RatingService,
    protected modalService: ModalService) { }

  ngOnInit(): void {
    for (let i = 1; i <= this.maxRating; i++) {
      this.starIndexes.push(i);
    }
  }
  //Bewertung wird abgegeben
 onRate(){
  this.ratingService.onRated(this.recipeId,this.rating);
  this.rating = 0;
  this.modalService.close()
 }
 onClose(){
  this.rating = 0;
  this.modalService.close()
 }
 //Hier wird der eingebewert aktualisiert
  updateRating(index: number): void {
    if (this.rate) { // Nur aktualisieren, wenn rate true ist
      this.rating = index;
      
    }
  }


}
