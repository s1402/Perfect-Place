import { TestBed } from '@angular/core/testing';
import { RegisterService } from './register.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { User } from '../common/enums/User';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegisterService],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RegisterService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a buyer', () => {
    let mockUserDetails: User = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: false,
    };
    let mockResponse = {
      message: 'OTP sent successfully',
    };
    service.register(mockUserDetails).subscribe((res) => {
      expect(res).toBeTrue();
    });

    let url = service['buyerUrl'];
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockUserDetails));
    req.flush(mockResponse);
  });

  it('should return false for empty response on registering a buyer', () => {
    let mockUserDetails: User = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: false,
    };
    let mockResponse = null;

    service.register(mockUserDetails).subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service['buyerUrl'];
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockUserDetails));
    req.flush(mockResponse);
  });

  it('should throw error on registering a buyer', (done) => {
    let mockUserDetails: User = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: false,
    };
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.register(mockUserDetails).subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    let url = service['buyerUrl'];
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockUserDetails));
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });

  it('should register a seller', () => {
    let mockUserDetails: User = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: true,
    };
    let mockResponse = {
      message: 'OTP sent successfully',
    };
    service.register(mockUserDetails, true).subscribe((res) => {
      expect(res).toBeTrue();
    });

    let url = service['sellerUrl'];
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockUserDetails));
    req.flush(mockResponse);
  });
});
