import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartDetails } from '../common/enums/Cart';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private readonly http: HttpClient) {}

  baseUrl = 'http://localhost:3000/api/cart';
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  addToCart(cartDetails: CartDetails): Observable<Object> {
    const url = `${this.baseUrl}/addToCart`;
    return this.http
      .post(url, JSON.stringify(cartDetails), { headers: this.httpHeaders })
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

  removeFromCart(buyerId: string, productId: string): Observable<Object> {
    const url = `${this.baseUrl}/removeFromCart/${buyerId}/${productId}`;
    return this.http.delete(url, { headers: this.httpHeaders }).pipe(
      map((response: any) => {
        if (response && response['message']) {
          return true;
        }
        return false;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  getCartDetails(buyerId: string): Observable<Object> {
    const url = `${this.baseUrl}/getAllProductsInCart/${buyerId}`;
    return this.http.get(url, { headers: this.httpHeaders }).pipe(
      map((response) => {
        if (response) {
          return response;
        }
        return false;
      }),
      catchError((error) => throwError(() => error))
    );
  }
}
