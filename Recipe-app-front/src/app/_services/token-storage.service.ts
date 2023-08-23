import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

// Schlüssel für das Speichern des Tokens in der Session Storage
const TOKEN_KEY = 'auth-token';

// Schlüssel für das Speichern des Benutzers in der Session Storage
const USER_KEY = 'auth-user';

// Ein Injectable-Dekorator, der angibt, dass der Dienst auf Root-Ebene bereitgestellt wird
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  // Funktion zum Abmelden des Benutzers: Löscht alle gespeicherten Daten aus der Session Storage
  signOut(): void {
    window.sessionStorage.clear();
  }

  // Funktion zum Speichern des Authentifizierungstokens in der Session Storage
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  // Funktion zum Abrufen des Authentifizierungstokens aus der Session Storage
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  // Funktion zum Speichern der Benutzerdaten in der Session Storage
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Funktion zum Abrufen der Benutzerdaten aus der Session Storage
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {}; // Rückgabe eines leeren Objekts, falls keine Benutzerdaten gefunden wurden
  }

  // Funktion zum Abrufen der Benutzer-ID aus den gespeicherten Benutzerdaten
  public getUserId(): number | null {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.id;
    }
  
    return null; // Rückgabe von null, wenn keine Benutzerdaten oder ID gefunden wurden
  }

  // Funktion zum Abrufen des Benutzerbildpfads aus den gespeicherten Benutzerdaten
  public getUserImagePath(){
    const user = window.sessionStorage.getItem(USER_KEY);
   
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.image; // Rückgabe des Bildpfads des Benutzers
    }
  }

  // Funktion zum Abrufen der primären Benutzerrolle aus den gespeicherten Benutzerdaten
  public getPrimaryUserRole(): string | null {
    const user = window.sessionStorage.getItem(USER_KEY);

    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.roles && parsedUser.roles.length > 0 ? parsedUser.roles[parsedUser.roles.length - 1] : null;
    }

    return null; // Rückgabe von null, wenn keine Benutzerdaten oder Rolle gefunden wurden
  }
}
