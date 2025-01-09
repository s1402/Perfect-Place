import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MyCartComponent } from './my-cart.component';
import { OrderService } from 'src/app/service/order.service';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { HeaderComponent } from 'src/app/common/component/header/header.component';
import { SharedService } from 'src/app/common/service/shared-service';
import { AuthService } from 'src/app/service/auth.service';
import { CartService } from 'src/app/service/cart.service';
import { of, throwError } from 'rxjs';
import { CartItem } from 'src/app/common/enums/Cart';

describe('MyCartComponent', () => {
  let component: MyCartComponent;
  let fixture: ComponentFixture<MyCartComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let loggerSpy: jasmine.SpyObj<NGXLogger>;
  let mockBuyer;

  beforeEach(async () => {
    orderServiceSpy = jasmine.createSpyObj('OrderService', [
      'buyNow',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isUserLoggedIn',
      'getTokenDetails',
    ]);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['getCartDetails','removeFromCart']);
    sharedServiceSpy = jasmine.createSpyObj('SharedService', [
      'setCartCount','decrementCartItemCount'
    ]);
    loggerSpy = jasmine.createSpyObj('NGXLogger', ['log', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const mockBuyerId = '121211';
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
      _id: mockBuyerId,
    };
    authServiceSpy.getTokenDetails.and.returnValue(mockBuyer);
    await TestBed.configureTestingModule({
      declarations: [ MyCartComponent, HeaderComponent],
       providers: [
              { provide: OrderService, useValue: orderServiceSpy },
              { provide: AuthService, useValue: authServiceSpy },
              { provide: CartService, useValue: cartServiceSpy },
              { provide: SharedService, useValue: sharedServiceSpy },
              { provide: NGXLogger, useValue: loggerSpy },
              { provide: Router, useValue: routerSpy },
            ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get cart details for a buyer on ngOnInit', () => {
    let mockResponse: CartItem[] = [{
       productId: {
         _id: '6731cdf16e636f2c85c803d9',
         description: 'Yellow Tshirt for kids',
         price: 397,
       },
       quantity: 2,
     }];
    cartServiceSpy.getCartDetails.and.returnValue(of(mockResponse));
    component.ngOnInit();
    expect(component.cartItems).toBe(mockResponse);
  });

  it('should log error on ngOnInit', () => {
    cartServiceSpy.getCartDetails.and.returnValue(throwError(() => new Error('Error fetching cart details')));
    component.ngOnInit();
    expect(loggerSpy.error).toHaveBeenCalled();
  });


  it('should remove an item from the cart', fakeAsync(() => {
    // Arrange
    const mockProductId = 'mockProductId';
    const mockCartItems: CartItem[] = [
      { productId: { _id: 'mockProductId' }, quantity: 1 },
      { productId: { _id: 'otherProductId' }, quantity: 2 },
    ];

    component.cartItems = mockCartItems;
    cartServiceSpy.removeFromCart.and.returnValue(of({}));

    // Act
    component.removeFromCart(mockProductId);
    tick(1000); // Simulate the delay for the timeout

    // Assert
    expect(sharedServiceSpy.decrementCartItemCount).toHaveBeenCalled();
    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith('121211', mockProductId);
    expect(component.cartItems.length).toBe(1);
    expect(component.cartItems[0].productId._id).toBe('otherProductId');
    expect(component.showItemRemovedMessage).toBeFalse();
  }));

  it('should log an error if removing an item fails', () => {
    // Arrange
    const mockProductId = 'mockProductId';
    const mockError = { message: 'Error removing product' };

    cartServiceSpy.removeFromCart.and.returnValue(throwError(() => mockError));

    // Act
    component.removeFromCart(mockProductId);

    // Assert
    expect(loggerSpy.error).toHaveBeenCalledWith('Error removing product from cart', mockError);
  });

  it('should handle successful purchase of items', fakeAsync(() => {
    // Arrange
    const mockCartItems: CartItem[] = [
      { productId: { _id: 'product1' }, quantity: 1 },
      { productId: { _id: 'product2' }, quantity: 2 },
    ];

    component.cartItems = mockCartItems;
    orderServiceSpy.buyNow.and.returnValue(of(true));

    // Act
    component.buyNow();
    tick(1000); // Simulate the delay for the timeout

    // Assert
    expect(orderServiceSpy.buyNow).toHaveBeenCalledWith({
      buyerId: '121211',
      products: [
        { productId: 'product1', quantity: 1 },
        { productId: 'product2', quantity: 2 },
      ],
    });
    expect(sharedServiceSpy.setCartCount).toHaveBeenCalledWith(0);
    expect(component.showSuccessBanner).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/buyer/home']);
  }));

  it('should log an error if purchase fails', () => {

    const mockCartItems: CartItem[] = [
      { productId: { _id: 'product1' }, quantity: 1 },
      { productId: { _id: 'product2' }, quantity: 2 },
    ];
    const mockError = { message: 'Error purchasing items' };

    component.cartItems = mockCartItems;
    orderServiceSpy.buyNow.and.returnValue(throwError(() => mockError));

    // Act
    component.buyNow();

    // Assert
    expect(loggerSpy.error).toHaveBeenCalledWith('Failed to purchase items', mockError);
  });
});
