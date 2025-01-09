import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserDetails } from '../common/enums/User';
import { SharedService } from '../common/service/shared-service';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private sellerUrl: string = 'http://localhost:3000/api/register/seller';
  private buyerUrl: string = 'http://localhost:3000/api/register/buyer';
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  constructor(private http: HttpClient) {}

  register(user: User, isSeller = false): Observable<Object> {
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
