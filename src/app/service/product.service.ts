import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/enums/Products';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = 'http://localhost:3000/api/products';
  private uploadImageUrl: string = 'http://localhost:3000/api/uploadImage';
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  constructor(private http: HttpClient) {}

  addProduct(product: Product): Observable<Object> {
    const addProductUrl = `${this.baseUrl}/addProduct`;
    return this.http
      .post(addProductUrl, JSON.stringify(product), {
        headers: this.httpHeaders,
      })
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

  getProductsBySeller(sellerId: string): Observable<Object> {
    const url = `${this.baseUrl}/getProductsBySeller/${sellerId}`;
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

  getAllProducts(): Observable<Object> {
    const url = `${this.baseUrl}/getAllProducts`;
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

  uploadImage(imageBase64: string): Observable<Object> {
    return this.http.post(
      this.uploadImageUrl,
      { imageBase64 },
      {
        headers: this.httpHeaders,
      }
    );
  }
}
