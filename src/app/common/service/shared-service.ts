import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserDetails } from '../enums/User';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  private cartItemCountSubject = new BehaviorSubject<number>(0);
  private isSellerSubject = new BehaviorSubject<boolean>(false);
  private registeredUserSubject = new BehaviorSubject<UserDetails|User>({});
  public cartItemObservable: Observable<number> = this.cartItemCountSubject.asObservable();
  public isSellerObservable: Observable<boolean> = this.isSellerSubject.asObservable();
  public registeredUserObservable: Observable<UserDetails|User> = this.registeredUserSubject.asObservable();

  setRegisteredUser(user:UserDetails|User ): void {
    this.registeredUserSubject.next(user);
  }

  setIsSeller(isSeller:boolean): void{
    this.isSellerSubject.next(isSeller);
  }

  incrementCartItemCount(): void {
    const count = this.cartItemCountSubject.getValue();
    this.cartItemCountSubject.next(count + 1);
  }

  decrementCartItemCount(): void {
    const count = this.cartItemCountSubject.getValue();
    if (count <= 0) {
      return;
    }
    this.cartItemCountSubject.next(count - 1);
  }

  setCartCount(count: number): void {
    this.cartItemCountSubject.next(count);
  }
}
