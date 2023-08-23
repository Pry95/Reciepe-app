

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
            private tokenStorageService: TokenStorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    //Hier wird Überpfüft ob der User authentifiziert ist oder nicht
    const isAuthenticated = this.tokenStorageService.getToken(); 

    if (!isAuthenticated) {
      // Benutzer ist nicht authentifiziert, Route blockieren und auf eine andere Route umleiten
      return this.router.parseUrl('/login');
    }

    // Benutzer ist authentifiziert, Route erlauben
    return true;
  }
}