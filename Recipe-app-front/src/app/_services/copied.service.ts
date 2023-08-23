import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject} from "rxjs";

import { TokenStorageService } from "./token-storage.service";

@Injectable()
export class CopiedService{

    private apiUrl = 'http://localhost:8080'; 
    copiedIds: number[] = [];
    //Auf dies werte kann aus anderen Componente reagiert werden wenn sie verändert wird
    copiedRecipesIdsChanged = new BehaviorSubject<number[]>([]);
    copiedRecipesIdsChanged$ = this.copiedRecipesIdsChanged.asObservable();


  constructor(
      private tokenStorageService: TokenStorageService,
      private http: HttpClient
  ){}

  //Gibt die Ids der Kopierten Rezepte zurück
  getCopiedIds(){
      return this.copiedIds;
  }

  //setzt die copiedIds und löst das copiedRecipesIdsChanged event aus
  setCopiedIds(ids: number[]){
    this.copiedIds = ids;
    this.copiedRecipesIdsChanged.next(ids);
  }

// holt von allen kopierten rezepten die Ids und aktauliesiert sie
  getCopyIdsFromDatabase() {
    const userId = this.tokenStorageService.getUserId();
    const result=this.http.post<any[]>(`${this.apiUrl}/api/copied/getCopiedIds`, { 
        userId: userId
        });

      result.subscribe({
        next: (response: any) => {
          this.setCopiedIds(response);
        },
        error: (error) => {
          console.error('Fehler vom Server:', error);
      }
    });
  }
}