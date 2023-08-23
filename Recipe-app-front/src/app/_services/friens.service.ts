import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject} from "rxjs";

import { TokenStorageService } from "./token-storage.service";
import { Friend } from "../Models/friend.model";
import { FriendRequest } from "../Models/friendRequest.model";
import { ToastService } from "./toast.service";

@Injectable()
export class FriendsService {

  constructor(
    private http:HttpClient,
    private tokenStorageService: TokenStorageService,
    private toastService: ToastService,
    ){}

  //Das ist ein event um  die veränderung der liste (möglicher Freunde) weiter zu geben.
  possibleFriendsChanged = new BehaviorSubject<Friend[]>([]);
  possibleFriendsChanged$ = this.possibleFriendsChanged.asObservable();


    //Das ist ein event um  die veränderung der liste (Freundschaftanfragen) weiter zu geben.
  friendRequestChanged = new BehaviorSubject<FriendRequest[]>([]);
  friendRequestChanged$ = this.friendRequestChanged.asObservable();


    //Das ist ein event um  die veränderung der liste (Freunde) weiter zu geben.
  friendsChanged = new BehaviorSubject<Friend[]>([]);
  friendsChanged$ = this.friendsChanged.asObservable();

  //Das ist ein event um  die veränderung des friendMode weiter zu geben.
  friendModeChanged = new BehaviorSubject<boolean>(false);
  friendModeChanged$ = this.friendModeChanged.asObservable();

  url = 'http://localhost:8080';
  possibleFriends: Friend[] = [];
  friendRequests: FriendRequest[] = [];
  friends: Friend[] = [];
  friendMode: Boolean = false;
    


    //Leert die liste der möglichen Freunde.
  clearPossibleFriends() {
    this.possibleFriends = [];
    this.possibleFriendsChanged.next(this.possibleFriends);
  }
  
   //Gibt die liste der Freundschaftsanfragen zurück.
  getFriendsRequests(){
    return this.friendRequests;
  }

  getPossibleFriends(){
    return this.possibleFriends;
  }
    
  //Gibt die liste der Freunde zurück.
  getFriends(){
      return this.friends
  }
    
  //Ändert den friendMode und gibt es den ander Coponenten mit.
  setFriendMode(boolean: boolean){
    this.friendMode = boolean;
    this.friendModeChanged.next(boolean);
  }
  
    
  //hier wird der suchstring und die userid des eingelogten users an das backend gesendet und
  //es wird dann eine liste aus möglichen freunde zurückgegeben und angezeigt
  searchFriends(searchString: string) {
    const userId =this.tokenStorageService.getUserId();
    console.log('Das ist constUserId', userId)
    //Wenn der suchstring leer ist wird die liste zurückgesetzt
    if (!searchString.trim()) {
      this.clearPossibleFriends();
      return;
    }
      
    const dataToSend = { 
      search: searchString ,
      userId: userId
    };
    
    const result = this.http.post(`${this.url}/api/friends/searchNewFriends`, dataToSend);
    result.subscribe({
      next: (response: any) => {
        this.possibleFriends = []      
        const possibleFriendsList = this.convertResultFriends(response);
    
        // Füge die konvertierten Daten in die Liste possibleFriends hinzu
        this.possibleFriends.push(...possibleFriendsList);
        this.possibleFriendsChanged.next(this.possibleFriends)
      },
      error: (error) => {
        console.error('Fehler vom Server:', error);
      }
    });
  }


    
  //Versendet Freundschaftanfragen.
  sendFriendRequest(recipientId:number) {
    const userId =this.tokenStorageService.getUserId();
    const dataToSend = { 
      recipientId: recipientId,
      senderId: userId
    };
    const possibleFriend =this.possibleFriends.find(pF=>pF.id===recipientId);
    this.possibleFriends=this.possibleFriends.filter(pF=>pF.id!==recipientId);
    this.possibleFriendsChanged.next(this.possibleFriends);

    const result = this.http.post(`${this.url}/api/friends/sendFriendRequest`, dataToSend);
    
    result.subscribe({
      next: (response: any) => {
        this.toastService.showToast('Rezept', 'Freundschaftsanfrage gesendet!', 'green', 2000);
      },
      error: (error) => {
        this.possibleFriends.push(possibleFriend);
        this.possibleFriendsChanged.next(this.possibleFriends);
        this.toastService.showToast('Fehler', 'Freundschaftsanfrage konnte nicht gesendet werden!: '
          + error, 'green', 2000);

      }
    });
  }


  //Holt die Ausstehnden Freundschaftsanfragen aus der Datenbank
  getFriendRequest() {
    const userId =this.tokenStorageService.getUserId();
    const dataToSend = { 
      userId: userId
    };

    const result = this.http.post(`${this.url}/api/friends/getFriendRequest`, dataToSend);
    
  
    result.subscribe({
      next: (response: any) => {
        const tempFriendReques = this.convertResultFriendRequest(response);
        //Hier werden die Arrays mit Freundschaftanfragen in Strings umbewandelt und 
        //miteinander verglichen.
        if(JSON.stringify(this.friendRequests) !== JSON.stringify(tempFriendReques)){
          this.friendRequests = [];
          this.friendRequests.push(...tempFriendReques)
          this.friendRequestChanged.next(this.friendRequests)
        }       
      },
      error: (error) => {
        console.error('Fehler vom Server:', error);
      }
    })
  }


  // gibt die liste von freunden zurück
  getFriendsFromDatabase(){
    const userId =this.tokenStorageService.getUserId();
    const dataToSend = { 
      userId: userId
    };

    const result = this.http.post(`${this.url}/api/friends/getFriends`, dataToSend);

    result.subscribe({
      next: (response: any) => {
          
        const tempFriends = this.convertResultFriends(response);
        //Wenn änderungen der Freunde besteht wird die liste aktualiesiert
        if(JSON.stringify(this.friends) !== JSON.stringify(tempFriends)){
          this.friends = [];
          this.friends.push(...tempFriends)
          this.friendsChanged.next(this.friends)
        };
      },
      error: (error) => {
        console.error('Fehler vom Server:', error);
      }
    })
  }
  // hier wird die freundschaftanfrage beanworted und dann aus der datenbank gelöscht
  answerFriendRequest(friendRequest: FriendRequest,answer:boolean){
    
    const recipientId = this.tokenStorageService.getUserId();
    const dataToSend = { 
      requestId: friendRequest.id,
      recipientId: recipientId,
      senderId: friendRequest.senderId,
      answer:answer

    };
    const toAnswerFriendRequest = this.friendRequests.find(fr=>fr.id === friendRequest.id);
    this.friendRequests = this.friendRequests.filter(fr=>fr.id !== friendRequest.id)
    this.friendRequestChanged.next(this.friendRequests)
    const result = this.http.post(`${this.url}/api/friends/answerFriendRequest`, dataToSend);
    
    result.subscribe({
      next: (response: any) => {
        console.log('Antwort vom Server:', response);
        if(answer){
          this.toastService.showToast('Freunde', 'Freundschaftsanfrage angenommen!', 'green', 2000);
        }else{
          this.toastService.showToast('Freunde', 'Freundschaftsanfrage abgelehnt!', 'green', 2000);
        }
      },
      error: (error) => {
        this.friendRequests.push(toAnswerFriendRequest);
        this.friendRequestChanged.next(this.friendRequests)
        this.toastService.showToast('Fehler', 'Fehler beim beantworten der  Freundschaftsanfrage!: '
        + error,'red', 2000);
      }
    });
  }


  // freunde entfernen
  delFriendShip(friendId:number){
    const userId =this.tokenStorageService.getUserId();
    const dataToSend = { 
      userId: userId,
      friendId:friendId
    };
    const friend = this.friends.find(fr=>fr.id === friendId);
    this.friends = this.friends.filter(f=>f.id !== friendId)
    this.friendsChanged.next(this.friends)

    const result = this.http.post(`${this.url}/api/friends/delFriends`, dataToSend);
    result.subscribe({
      next: (response) => {
        console.log(response);
        this.toastService.showToast('Freunde', 'Freund entfernt!', 'green', 2000);
        
      },
      error: (error) => {
        this.friends.push(friend);
        this.friendsChanged.next(this.friends)
        this.toastService.showToast('Fehler', 'Fehler beim entfernen des Freundes!: ' + error, 'green', 2000);
      }
    })
  }
    
      

  //Wandelt das Result aus dem Backend  in ein Array von Freunden oder Möglichen Freunden.
  convertResultFriends(results: any[]): Friend[] {
    const friendsList: Friend[] = [];
  
    for (const result of results) {
      const name = result.username;
      const id = result.id
      const imagePath = result.image;
      const newPossibleFriend = new Friend(id,name, imagePath);
      friendsList.push(newPossibleFriend);
    }
  
    return friendsList;
  }


  //Wandelt das Result aus dem Backend  in ein Array von Freundschaftanfragen.
  convertResultFriendRequest(results: any[]): FriendRequest[] {
    const friendRequestList: FriendRequest[] = [];
    for (const result of results){
      const requestId = result.id;
      const senderId = result.senderId;
      const senderName = result.senderName;
      const senderImagePath = result.senderImagePath;
      const newFriendRequest = new FriendRequest(requestId,senderId,senderName,senderImagePath);
      friendRequestList.push(newFriendRequest);
    }
      return friendRequestList;
  }
}