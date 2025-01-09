import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartDetails, CartItem } from '../common/enums/Cart';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [HttpClientTestingModule],
      providers: [
        CartService
      ]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully add to cart', () => {
    let mockCartDetails: CartDetails = {
      buyerId: 'buyerId',
      productId: 'productId',
      quantity: 1
    };
    let mockResponse = {
       message: "Product added to cart", 
       cart: mockCartDetails 
    };
    service.addToCart(mockCartDetails).subscribe((res) => {
      expect(res).toBeTrue();
    });

    let url = service.baseUrl + '/addToCart';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockCartDetails));
    req.flush(mockResponse);
  });

  
  it('should return false for empty response on add to cart', () => {
    let mockCartDetails: CartDetails = {
      buyerId: 'buyerId',
      productId: 'productId',
      quantity: 1
    };
    let mockResponse = {};

    service.addToCart(mockCartDetails).subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service.baseUrl + '/addToCart';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockCartDetails));
    req.flush(mockResponse);
  });

  it('should throw error on add to cart', (done) => {
    let mockCartDetails: CartDetails = {
      buyerId: 'buyerId',
      productId: 'productId',
      quantity: 1
    };
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.addToCart(mockCartDetails).subscribe({
      next: ()=> fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    let url = service.baseUrl + '/addToCart';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockCartDetails));
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });

  it('should successfully removeFromCart', () => {
    let mockResponse = {
       message: "Product removed from cart", 
       cart: []
    };
    service.removeFromCart('buyerId','productId').subscribe((res) => {
      expect(res).toBeTrue();
    });

    let url = service.baseUrl + `/removeFromCart/buyerId/productId`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toBeNull();
    req.flush(mockResponse);
  });

  
  it('should return false for empty response on removeFromCart', () => {
    let mockResponse = {};

    service.removeFromCart('buyerId','productId').subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service.baseUrl + '/removeFromCart/buyerId/productId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should throw error on removeFromCart', (done) => {
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.removeFromCart('buyerId','productId').subscribe({
      next: ()=> fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    let url = service.baseUrl +  '/removeFromCart/buyerId/productId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });

  it('should successfully getCartDetails', () => {
    let mockResponse: CartItem = {
      productId: {
        _id: '6731cdf16e636f2c85c803d9',
        description: 'Yellow Tshirt for kids',
        price: 397,
      },
      quantity: 2,
    };
    service.getCartDetails('buyerId').subscribe((res) => {
      expect(res).toBe(mockResponse);
    });

    let url = service.baseUrl + `/getAllProductsInCart/buyerId`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    expect(req.request.body).toBeNull();
    req.flush(mockResponse);
  });

  
  it('should return false for empty response on getCartDetails', () => {
    let mockResponse = null;

    service.getCartDetails('buyerId').subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service.baseUrl + '/getAllProductsInCart/buyerId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should throw error on removeFromCart', (done) => {
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.getCartDetails('buyerId').subscribe({
      next: ()=> fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    let url = service.baseUrl +  '/getAllProductsInCart/buyerId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });
});
