import { Component, OnInit} from '@angular/core';
import { ModalService } from '../_services/modal.service';
import { Router } from '@angular/router';
import { FriendsService } from '../_services/friens.service';
import { AppComponent } from '../app.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  friendMode: boolean = false;
  publicMode: boolean = false;

  
 
  constructor(protected modalService:ModalService,
    private router: Router,
    private friendService: FriendsService,
    private app: AppComponent,
    ) { }

  ngOnInit(): void {

    this.app.ngOnInit();
    //wenn die seite geewechselt oder neu geladen wird
    
    this.friendService.setFriendMode(true) 
  }
}

 

