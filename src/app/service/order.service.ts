import { Injectable } from '@angular/core';
import { CartDetails } from '../common/enums/Cart';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderDetails } from '../common/enums/Order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:3000/api/orders';
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  buyNow(orderDetails: OrderDetails): Observable<boolean> {
    return this.http
      .post(`${this.baseUrl}/createOrder`, JSON.stringify(orderDetails), {
        headers: this.httpHeaders,
      })
      .pipe(
        map((response:any) => {
          if (response && response['message']) {
            return true;
          }
          return false;
        }),
        catchError((error) => throwError(() => error))
      );
  }

  getMyOrdersBuyer(buyerId: string): Observable<Object> {
    return this.http
      .get(`${this.baseUrl}/buyer/getMyOrders/${buyerId}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((response) => {
          if (response) {
            return response;
          }
          return false;
        }),
        catchError((error) => throwError(() => error))
      );
  }

  getMyOrdersSeller(sellerId: string): Observable<Object> {
    return this.http
      .get(`${this.baseUrl}/seller/getMyOrders/${sellerId}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((response) => {
          if (response) {
            return response;
          }
          return false;
        }),
        catchError((error) => throwError(() => error))
      );
  }

  updateOrderStatus(orderId: string, orderStatus: string): Observable<boolean> {
    return this.http
      .patch(
        `${this.baseUrl}/updateStatus/${orderId}`,
        JSON.stringify({ status: orderStatus }),
        {
          headers: this.httpHeaders,
        }
      )
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
