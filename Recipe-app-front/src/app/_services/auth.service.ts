import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definiere die URL für die Authentifizierung API
const AUTH_API = 'http://localhost:8080/api/auth/';
// Definiere HTTP-Optionen, wie z. B. der Header
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    
    ) { }
    // Methode für den Benutzer-Login
  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }
// Methode für die Benutzerregistrierung
  register(formData: FormData): Observable<any> {
    return this.http.post(AUTH_API +'signup', formData);
  }
}
