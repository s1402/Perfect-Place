import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { OrderDetails, Orders } from '../common/enums/Order';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OrderService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully create the order', () => {
    let mockOrderDetails: OrderDetails = {
      buyerId: 'buyerId',
      products: [],
    };
    let mockResponse = {
      message: 'Order created successfully',
    };
    service.buyNow(mockOrderDetails).subscribe((res) => {
      expect(res).toBeTrue();
    });

    let url = service['baseUrl'] + '/createOrder';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockOrderDetails));
    req.flush(mockResponse);
  });

  it('should return false for empty response on createOrder', () => {
    let mockOrderDetails: OrderDetails = {
      buyerId: 'buyerId',
      products: [],
    };
    let mockResponse = {};

    service.buyNow(mockOrderDetails).subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service['baseUrl'] + '/createOrder';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockOrderDetails));
    req.flush(mockResponse);
  });

  it('should throw error on creating order', (done) => {
    let mockOrderDetails: OrderDetails = {
      buyerId: 'buyerId',
      products: [],
    };
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.buyNow(mockOrderDetails).subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    let url = service['baseUrl'] + '/createOrder';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockOrderDetails));
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });

  it('should successfully get orders for buyer', () => {
    let mockResponse: Orders[] = [
      {
        status: 'Delivered',
        products: [],
        totalPrice: 300,
        _id: '23213123',
        createdAt: new Date(Date.now()),
      },
    ];
    service.getMyOrdersBuyer('buyerId').subscribe((res) => {
      expect(res).toBe(mockResponse);
    });

    let url = service['baseUrl'] + '/buyer/getMyOrders/buyerId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return false for empty response on getting orders for buyer', () => {
    let mockResponse = null;
    service.getMyOrdersBuyer('buyerId').subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service['baseUrl'] + '/buyer/getMyOrders/buyerId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should throw error on getting orders for a buyer', (done) => {
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.getMyOrdersBuyer('buyerId').subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    let url = service['baseUrl'] + '/buyer/getMyOrders/buyerId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });

  it('should successfully get orders for seller', () => {
    let mockResponse: Orders[] = [
      {
        status: 'Delivered',
        products: [],
        totalPrice: 300,
        _id: '23213123',
        createdAt: new Date(Date.now()),
      },
    ];
    service.getMyOrdersSeller('sellerId').subscribe((res) => {
      expect(res).toBe(mockResponse);
    });

    let url = service['baseUrl'] + '/seller/getMyOrders/sellerId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return false for empty response on getting orders for seller', () => {
    let mockResponse = null;
    service.getMyOrdersSeller('sellerId').subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service['baseUrl'] + '/seller/getMyOrders/sellerId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should throw error on getting orders for a seller', (done) => {
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.getMyOrdersSeller('sellerId').subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    let url = service['baseUrl'] + '/seller/getMyOrders/sellerId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });

  it('should successfully update order status', () => {
    let orderStatus = 'Order  Delivered';
    let mockOrderStatus = { status: orderStatus }
    let mockResponse = {
     message: 'Order Updated successfully',
     order: {}
    };
    service.updateOrderStatus('orderId',orderStatus).subscribe((res) => {
      expect(res).toBeTrue();
    });

    let url = service['baseUrl'] + '/updateStatus/orderId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(JSON.stringify(mockOrderStatus));
    req.flush(mockResponse);
  });

  it('should return false for empty response on updating order status', () => {
    let orderStatus = 'Order  Delivered';
    let mockOrderStatus = { status: orderStatus }
    let mockResponse = null;

    service.updateOrderStatus('orderId',orderStatus).subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service['baseUrl'] + '/updateStatus/orderId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(JSON.stringify(mockOrderStatus));
    req.flush(mockResponse);
  });

  it('should throw error on updating order status', (done) => {
    let orderStatus = 'Order  Delivered';
    let mockOrderStatus = { status: orderStatus }

    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.updateOrderStatus('orderId',orderStatus).subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    let url = service['baseUrl'] + '/updateStatus/orderId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(JSON.stringify(mockOrderStatus));
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });
});
