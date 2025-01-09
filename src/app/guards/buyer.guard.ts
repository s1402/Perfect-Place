import { Injectable } from '@angular/core';
import {
  Router,
} from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BuyerGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (
      !this.authService.isUserLoggedIn() ||
      this.authService.getTokenDetails()?.isSeller
    ) {
      this.router.navigate(['/buyer/login']);
      return false;
    }
    return true;
  }
}
