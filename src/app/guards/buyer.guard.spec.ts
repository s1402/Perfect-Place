import { TestBed } from '@angular/core/testing';
import { BuyerGuard } from './buyer.guard';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { TokenDetails } from '../common/enums/TokenDetails';

describe('BuyerGuard', () => {
  let guard: BuyerGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let mockBuyer: TokenDetails | null;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isUserLoggedIn',
      'getTokenDetails',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockBuyer = {
      isSeller: false,
      address: {
        city: 'New York',
        state: 'NY',
        postcalCode: '123123',
        street: 'Albaquergie',
      },
      email: 'hb@hotmail.com',
      name: 'heisenberg',
      iat: '12121231',
      _id: 'mockBuyerId',
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    guard = TestBed.inject(BuyerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is logged in and not a buyer', () => {
    // Arrange
    authServiceSpy.isUserLoggedIn.and.returnValue(true);
    authServiceSpy.getTokenDetails.and.returnValue(mockBuyer);

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not allow activation if user is not logged in ', () => {
    // Arrange
    authServiceSpy.isUserLoggedIn.and.returnValue(false);
    authServiceSpy.getTokenDetails.and.returnValue(mockBuyer);

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/buyer/login']);
  });

  it('should not allow activation if user is a seller ', () => {
    // Arrange
    authServiceSpy.isUserLoggedIn.and.returnValue(false);
    let mockSeller = {
      isSeller: true,
      address: {
        city: 'New York',
        state: 'NY',
        postcalCode: '123123',
        street: 'Albaquergie',
      },
      email: 'hb@hotmail.com',
      name: 'heisenberg',
      iat: '12121231',
      _id: 'mockBuyerId',
    };
    authServiceSpy.getTokenDetails.and.returnValue(mockSeller);

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/buyer/login']);
  });
});
