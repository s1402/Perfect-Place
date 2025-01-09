import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TokenDetails } from '../common/enums/TokenDetails';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../common/enums/User';
import { SharedService } from '../common/service/shared-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private sellerUrl: string = 'http://localhost:3000/api/login/seller';
  private buyerUrl: string = 'http://localhost:3000/api/login/buyer';
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(user: User, isSeller = false): Observable<Object> {
    let url = isSeller ? this.sellerUrl : this.buyerUrl;
    return this.http
      .post(url, JSON.stringify(user), { headers: this.httpHeaders })
      .pipe(
        map((response: any) => {
          if (response && response['token']) {
            localStorage.setItem('token', response['token']);
            return true;
          }
          return false;
        }),
        catchError((error) => throwError(() => error))
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  isUserLoggedIn(): boolean {
    const JwtHelper = new JwtHelperService();
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }
    return !JwtHelper.isTokenExpired(token);
  }

  getTokenDetails(): TokenDetails | null {
    const JwtHelper = new JwtHelperService();
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return JwtHelper.decodeToken(token);
  }
}
