import { TestBed } from '@angular/core/testing';
import { SellerGuard } from './seller.guard';
import { Router } from '@angular/router';
import { TokenDetails } from '../common/enums/TokenDetails';
import { AuthService } from '../service/auth.service';

describe('SellerGuard', () => {
  let guard: SellerGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let mockSeller: TokenDetails | null;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isUserLoggedIn',
      'getTokenDetails',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockSeller = {
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
      _id: 'mockSellerId',
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    guard = TestBed.inject(SellerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  
  it('should allow activation if user is logged in and not a seller', () => {
    // Arrange
    authServiceSpy.isUserLoggedIn.and.returnValue(true);
    authServiceSpy.getTokenDetails.and.returnValue(mockSeller);

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not allow activation if user is not logged in ', () => {
    // Arrange
    authServiceSpy.isUserLoggedIn.and.returnValue(false);
    authServiceSpy.getTokenDetails.and.returnValue(mockSeller);

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/seller/login']);
  });

  it('should not allow activation if user is a buyer ', () => {
    // Arrange
    authServiceSpy.isUserLoggedIn.and.returnValue(false);
    let mockBuyer = {
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
    authServiceSpy.getTokenDetails.and.returnValue(mockBuyer);

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/seller/login']);
  });
});
