import { TestBed } from '@angular/core/testing';

import { VerifyEmailService } from './verify-email.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { UserDetails } from '../common/enums/User';

describe('VerifyEmailService', () => {
  let service: VerifyEmailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VerifyEmailService],
    });
    service = TestBed.inject(VerifyEmailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should verify email for a buyer', () => {
    let mockUserDetails: UserDetails = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: false,
    };
    let mockResponse = {
      message: 'Email verified successfully',
    };
    service.verifyEmail(mockUserDetails).subscribe((res) => {
      expect(res).toBeTrue();
    });

    let url = service['buyerUrl'];
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockUserDetails));
    req.flush(mockResponse);
  });

  it('should return false for empty response on verifying email for a buyer', () => {
    let mockUserDetails: UserDetails = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: false,
    };
    let mockResponse = null;

    service.verifyEmail(mockUserDetails).subscribe((res) => {
      expect(res).toBeFalse();
    });

    let url = service['buyerUrl'];
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockUserDetails));
    req.flush(mockResponse);
  });

  it('should throw error on verifying email for a buyer', (done) => {
    let mockUserDetails: UserDetails = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: false,
    };
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
    };

    service.verifyEmail(mockUserDetails).subscribe({
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

  it('should verify email for a seller', () => {
    let mockUserDetails: UserDetails = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: true,
    };
    let mockResponse = {
      message: 'Email verified successfully',
    };
    service.verifyEmail(mockUserDetails, true).subscribe((res) => {
      expect(res).toBeTrue();
    });

    let url = service['sellerUrl'];
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockUserDetails));
    req.flush(mockResponse);
  });
});
