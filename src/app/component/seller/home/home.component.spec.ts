import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HomeSellerComponent } from './home.component';
import { OrderService } from 'src/app/service/order.service';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from 'src/app/service/auth.service';
import { HeaderComponent } from 'src/app/common/component/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { Orders } from 'src/app/common/enums/Order';
import { of, throwError } from 'rxjs';
import { TokenDetails } from 'src/app/common/enums/TokenDetails';

describe('HomeSellerComponent', () => {
  let component: HomeSellerComponent;
  let fixture: ComponentFixture<HomeSellerComponent>;
  let loggerSpy: jasmine.SpyObj<NGXLogger>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const mockOrders: Orders[] = [
    {
      _id: 'order1',
      status: 'Order Received',
      createdAt: new Date('2024-12-01T10:00:00Z'),
      products: [
        {
          productId: {
            _id: 'product1',
            name: 'Product 1',
            description: 'Description of Product 1',
            price: 100,
            category: 'Category A',
            images: [
              { url: 'http://example.com/image1.jpg', altText: 'Image 1' },
              { url: 'http://example.com/image2.jpg', altText: 'Image 2' },
            ],
          },
          quantity: 2,
        },
        {
          productId: {
            _id: 'product2',
            name: 'Product 2',
            description: 'Description of Product 2',
            price: 200,
            category: 'Category B',
            images: [
              { url: 'http://example.com/image3.jpg', altText: 'Image 3' },
            ],
          },
          quantity: 1,
        },
      ],
      totalPrice: 400,
    },
    {
      _id: 'order2',
      status: 'Order Shipped',
      createdAt: new Date('2024-12-05T12:30:00Z'),
      products: [
        {
          productId: {
            _id: 'product3',
            name: 'Product 3',
            description: 'Description of Product 3',
            price: 50,
            category: 'Category C',
            images: [
              { url: 'http://example.com/image4.jpg', altText: 'Image 4' },
            ],
          },
          quantity: 3,
        },
      ],
      totalPrice: 150,
    },
  ];

  const mockTokenDetails: TokenDetails = {
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
    _id: '121211',
  };

  beforeEach(async () => {
    loggerSpy = jasmine.createSpyObj('NGXLogger', ['log', 'error']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getTokenDetails',
      'isUserLoggedIn',
    ]);
    orderServiceSpy = jasmine.createSpyObj('OrderService', [
      'getMyOrdersSeller',
      'updateOrderStatus',
    ]);
    await TestBed.configureTestingModule({
      declarations: [HomeSellerComponent, HeaderComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: NGXLogger, useValue: loggerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch orders for the seller if sellerId exists on ngOnInit', () => {
    authServiceSpy.getTokenDetails.and.returnValue(mockTokenDetails);
    orderServiceSpy.getMyOrdersSeller.and.returnValue(of(mockOrders));

    component.ngOnInit();

    expect(orderServiceSpy.getMyOrdersSeller).toHaveBeenCalledWith('121211');
    expect(component.orders).toEqual(mockOrders);
  });

  it('should log an error if fetching orders fails on ngOnInit', () => {
    authServiceSpy.getTokenDetails.and.returnValue(mockTokenDetails);
    orderServiceSpy.getMyOrdersSeller.and.returnValue(
      throwError(() => new Error('Fetch error'))
    );

    component.ngOnInit();

    expect(orderServiceSpy.getMyOrdersSeller).toHaveBeenCalledWith('121211');
    expect(loggerSpy.error).toHaveBeenCalledWith(
      'Failed to fetch orders.',
      jasmine.any(Error)
    );
  });

  it('should do nothing if sellerId is undefined on ngOnInit', () => {
    authServiceSpy.getTokenDetails.and.returnValue(null);
    component.ngOnInit();
    expect(orderServiceSpy.getMyOrdersSeller).not.toHaveBeenCalled();
  });

  it('should update order status and show success banner on success', fakeAsync(() => {
    orderServiceSpy.updateOrderStatus.and.returnValue(of(true));
    component.updateOrderStatus('order123', 'Order Delivered!🥳');
    expect(component.showSuccessBanner).toBeTrue();
    expect(loggerSpy.log).toHaveBeenCalledWith(
      'Order status updated succesfuly'
    );
    tick(2000);
    expect(orderServiceSpy.updateOrderStatus).toHaveBeenCalledWith(
      'order123',
      'Order Delivered!🥳'
    );
    expect(component.showSuccessBanner).toBeFalse();
  }));

  it('should log an error if updating order status fails on updateOrderStatus', () => {
    orderServiceSpy.updateOrderStatus.and.returnValue(
      throwError(() => new Error('Update error'))
    );
    component.updateOrderStatus('order123', 'Order Delivered!🥳');
    expect(orderServiceSpy.updateOrderStatus).toHaveBeenCalledWith(
      'order123',
      'Order Delivered!🥳'
    );
    expect(loggerSpy.error).toHaveBeenCalledWith(
      'Failed to update order status.',
      jasmine.any(Error)
    );
  });

  it('should log an error if response is false on updateOrderStatus ', () => {
    orderServiceSpy.updateOrderStatus.and.returnValue(of(false));
    component.updateOrderStatus('order123', 'Order Delivered!🥳');
    expect(loggerSpy.error).toHaveBeenCalledWith(
      'Failed to update order status.'
    );
  });

  it('should calculate the total price of all orders', () => {
    component.orders = mockOrders;
    const totalPrice = component.calculateTotalPrice();
    expect(totalPrice).toBe(550);
  });

  it('should return 0 if there are no orders', () => {
    component.orders = [];
    const totalPrice = component.calculateTotalPrice();
    expect(totalPrice).toBe(0);
  });
});
