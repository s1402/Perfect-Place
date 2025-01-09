import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyOrdersComponent } from './my-orders.component';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from 'src/app/service/auth.service';
import { OrderService } from 'src/app/service/order.service';
import { HeaderComponent } from 'src/app/common/component/header/header.component';
import { Orders } from 'src/app/common/enums/Order';
import { of, throwError } from 'rxjs';

describe('MyOrdersComponent', () => {
  let component: MyOrdersComponent;
  let fixture: ComponentFixture<MyOrdersComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let loggerSpy: jasmine.SpyObj<NGXLogger>;
  let mockBuyer;

  beforeEach(async () => {
    loggerSpy = jasmine.createSpyObj('NGXLogger', ['log', 'error']);
    orderServiceSpy = jasmine.createSpyObj('OrderService', [
      'getMyOrdersBuyer',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isUserLoggedIn',
      'getTokenDetails',
    ]);
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
      declarations: [MyOrdersComponent, HeaderComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NGXLogger, useValue: loggerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyOrdersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get order details for a buyer on ngOnInit', () => {
    let mockResponse: Orders[] = [
      {
        status: 'Delivered',
        products: [],
        totalPrice: 300,
        _id: '23213123',
        createdAt: new Date(Date.now()),
      },
    ];
    orderServiceSpy.getMyOrdersBuyer.and.returnValue(of(mockResponse));
    component.ngOnInit();
    expect(component.orders).toBe(mockResponse);
  });

  it('should log error on ngOnInit', () => {
    orderServiceSpy.getMyOrdersBuyer.and.returnValue(
      throwError(() => new Error())
    );
    component.ngOnInit();
    expect(loggerSpy.error).toHaveBeenCalledWith('Failed to fetch orders.');
  });
});
