import { TestBed } from '@angular/core/testing';

import { SharedService } from './shared-service';
import { UserDetails } from '../enums/User';
import { skip, take } from 'rxjs';

describe('SharedServiceService', () => {
  let service: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should setRegisteredUser and emit the registered user', (done) => {
    const mockUser: UserDetails = { name: 'John', email: 'john@example.com' ,isSeller: true };
    service.registeredUserObservable.pipe(skip(1),take(1)).subscribe((user) => {
      expect(user).toEqual(mockUser);
      done();
    });
    service.setRegisteredUser(mockUser);
  });

  it('should setIsSeller and emit whether the user is a seller', (done) => {
    service.isSellerObservable.pipe(skip(1),take(1)).subscribe((isSeller) => {
      expect(isSeller).toBeTrue();
      done();
    });
    service.setIsSeller(true);
  });

  it('should increment cart item count', (done) => {
    service.cartItemObservable.pipe(skip(1),take(1)).subscribe((count) => {
      expect(count).toBe(1);
      done();
    });
    service.incrementCartItemCount();
  });

  it('should decrement cart item count', (done) => {
    service.setCartCount(3);
    service.cartItemObservable.pipe(skip(1),take(1)).subscribe((count) => {
      expect(count).toBe(2);
      done();
    });
    service.decrementCartItemCount();
  });

  it('should not decrement cart item count <= 0', (done) => {
    service.cartItemObservable.subscribe((count) => {
      expect(count).toBe(0);
      done();
    });
    service.decrementCartItemCount();
  });

  it('should set the cart count', (done) => {
    const mockCount = 5;
    service.cartItemObservable.pipe(skip(1),take(1)).subscribe((count) => {
      expect(count).toBe(mockCount);
      done();
    });
    service.setCartCount(mockCount);
  });
});
