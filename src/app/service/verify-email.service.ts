import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UserDetails } from '../common/enums/User';

@Injectable({
  providedIn: 'root',
})
export class VerifyEmailService {
  private sellerUrl: string =
    'http://localhost:3000/api/register/verify-email/seller';
  private buyerUrl: string =
    'http://localhost:3000/api/register/verify-email/buyer';
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  constructor(private http: HttpClient) {}

  verifyEmail(user: UserDetails, isSeller = false): Observable<Object> {
    let url = isSeller ? this.sellerUrl : this.buyerUrl;
    return this.http
      .post(url, JSON.stringify(user), { headers: this.httpHeaders })
      .pipe(
        map((response: any) => {
          if (response && response['message']) {
            return true;
          }
          return false;
        }),
        catchError((error) => throwError(() => error))
      );
  }
}
