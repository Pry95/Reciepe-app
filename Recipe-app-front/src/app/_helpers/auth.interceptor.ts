import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../_services/token-storage.service';
import { Observable } from 'rxjs';

//Name für ein spezielles Feld im Header einer Anfrage.
//TOKEN_HEADER_KEY id Namen des Felds, das den Authentifizierungstoken enthält.
const TOKEN_HEADER_KEY = 'x-access-token';  

@Injectable()
//HttpInterceptor überwacht die HTTP anfragen
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) { }

  //Hier wird dafür gesorgt das der jsonwebtoken mitgesendet wird !
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Erstelle eine Kopie der Anfrage, um sie später möglicherweise zu verändern
    let authReq = req;
    const token = this.token.getToken();
    if (token != null) {
    // Wenn ein Token vorhanden ist, erstelle eine modifizierte Kopie der Anfrage
    // Füge den Token als Header zum authReq hinzu
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });
    }
    // Leite die modifizierte Anfrage an den nächsten Schritt weiter (nächster Interceptor oder Backend)
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  // Ein Provider-Objekt wird erstellt
  {
    // 'provide' gibt an, welches Token (Service oder Klassenname) verwendet wird, um den Interceptor zu finden
    provide: HTTP_INTERCEPTORS,
    // 'useClass' gibt die Klasse des Interceptors an, die verwendet werden soll
    useClass: AuthInterceptor,
    // 'multi' gibt an, ob mehrere Provider desselben Typs gleichzeitig verwendet werden können
    multi: true
  }
];