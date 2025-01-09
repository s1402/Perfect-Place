import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  Product,
  ProductCategory,
  ProductDetails,
} from '../common/enums/Products';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProductService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully add a product', () => {
    let mockProductDetails: Product = {
      name: 'tshirt',
      description: '100 % cotton',
      price: '300',
      stock: 20,
      category: ProductCategory.MEN,
      images: [{ url: '', altText: '' }],
      sellerId: 'sellerId',
      currentIndex: 0,
    };
    let mockResponse = {
      message: 'Product added successfuly',
    };
    service.addProduct(mockProductDetails).subscribe((res) => {
      expect(res).toBeTrue();
    });

    let url = service['baseUrl'] + '/addProduct';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockProductDetails));
    req.flush(mockResponse);
  });

  it('should return false for empty response on adding product', () => {
    let mockProductDetails: Product = {
      name: 'tshirt',
      description: '100 % cotton',
      price: '300',
      stock: 20,
      category: ProductCategory.MEN,
      images: [{ url: '', altText: '' }],
      sellerId: 'sellerId',
      currentIndex: 0,
    };
    let mockResponse = {};

    service.addProduct(mockProductDetails).subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service['baseUrl'] + '/addProduct';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockProductDetails));
    req.flush(mockResponse);
  });

  it('should throw error on adding product', (done) => {
    let mockProductDetails: Product = {
      name: 'tshirt',
      description: '100 % cotton',
      price: '300',
      stock: 20,
      category: ProductCategory.MEN,
      images: [{ url: '', altText: '' }],
      sellerId: 'sellerId',
      currentIndex: 0,
    };
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.addProduct(mockProductDetails).subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    let url = service['baseUrl'] + '/addProduct';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockProductDetails));
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });

  it('should successfully get products by sellerId', () => {
    let mockResponse: Product = {
      name: 'tshirt',
      description: '100 % cotton',
      price: '300',
      stock: 20,
      category: ProductCategory.MEN,
      images: [{ url: '', altText: '' }],
      sellerId: 'sellerId',
      currentIndex: 0,
    };
    service.getProductsBySeller('sellerId').subscribe((res) => {
      expect(res).toBe(mockResponse);
    });

    let url = service['baseUrl'] + '/getProductsBySeller/sellerId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return false for empty response on getting products by seller', () => {
    let mockResponse = null;

    service.getProductsBySeller('sellerId').subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service['baseUrl'] + '/getProductsBySeller/sellerId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should throw error on getting products by seller', (done) => {
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.getProductsBySeller('sellerId').subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    let url = service['baseUrl'] + '/getProductsBySeller/sellerId';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });

  it('should successfully get all products', () => {
    let mockResponse: ProductDetails = {
      name: 'tshirt',
      description: '100 % cotton',
      price: '300',
      stock: 20,
      category: ProductCategory.MEN,
      images: [{ url: '', altText: '' }],
      sellerId: {
        businessName: 'chagani',
        email: 'chagani@hotmail.com',
      },
      currentIndex: 0,
    };
    service.getAllProducts().subscribe((res) => {
      expect(res).toBe(mockResponse);
    });

    let url = service['baseUrl'] + '/getAllProducts';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return false for empty response on getting all products', () => {
    let mockResponse = null;

    service.getAllProducts().subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service['baseUrl'] + '/getAllProducts';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should throw error on getting all products', (done) => {
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.getAllProducts().subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    let url = service['baseUrl'] + '/getAllProducts';
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });

  it('should successfully upload image', () => {
    let mockImageUrl = { imageBase64: 'imageBase64' };
    service.uploadImage('imageBase64').subscribe((res) => {
      expect(res).toBe(mockImageUrl);
    });

    let url = service['uploadImageUrl'];
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockImageUrl);
    req.flush(mockImageUrl);
  });
});
