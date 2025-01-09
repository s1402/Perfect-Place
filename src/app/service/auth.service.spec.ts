import { JwtHelperService } from '@auth0/angular-jwt';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { User } from '../common/enums/User';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;
  let jwtHelperServiceSpy: jasmine.SpyObj<JwtHelperService>;
  let mockValidJwtToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    jwtHelperServiceSpy = jasmine.createSpyObj('JwtHelperService', [
      'isTokenExpired',
      'decodeToken',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: JwtHelperService, useValue: jwtHelperServiceSpy },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('seller should login successfuly and store the token if token exists', () => {
    let mockSeller: User = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: true,
    };
    let mockResponse = {
      token: 'mockToken',
    };
    service.login(mockSeller, true).subscribe((res) => {
      expect(res).toBeTrue();
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
    });

    const req = httpMock.expectOne(service['sellerUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockSeller));
    req.flush(mockResponse);
  });

  it('seller should not login successfuly if token does not exists', () => {
    let mockSeller: User = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: true,
    };
    let mockResponse = {};
    service.login(mockSeller, true).subscribe((res) => {
      expect(res).toBeFalse();
      expect(localStorage.getItem('token')).toBe(null);
    });

    const req = httpMock.expectOne(service['sellerUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockSeller));
    req.flush(mockResponse);
  });

  it('buyer should login successfuly and store the token if token exists', () => {
    let mockBuyer: User = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: false,
    };
    let mockResponse = {
      token: 'mockToken',
    };
    service.login(mockBuyer).subscribe((res) => {
      expect(res).toBeTrue();
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
    });

    const req = httpMock.expectOne(service['buyerUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockBuyer));
    req.flush(mockResponse);
  });

  it('should throw error on login', (done) => {
    let mockUser: User = {
      email: 'sr@gmail.com',
      password: '12341234',
      name: 'shobhit',
      isSeller: false,
    };
    const mockErrorResponse = {
      status: 401,
      statusText: 'Unauthorized',
    };

    service.login(mockUser, false).subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.statusText).toBe('Unauthorized');
        done(); // Ensures test waits for async operations to complete
      },
    });

    const req = httpMock.expectOne(service['buyerUrl']);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Unauthorized' }, mockErrorResponse);
  });

  it('should remove the token and navigate to home page on logout', () => {
    localStorage.setItem('token', 'mockToken');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('isUserLoggedIn should return false if no token present', () => {
    const result = service.isUserLoggedIn();
    expect(localStorage.getItem('token')).toBeNull();
    expect(result).toBeFalse();
  });

  it('isUserLoggedIn should return true if token is present and not expired', () => {
    localStorage.setItem('token', mockValidJwtToken);
    const result = service.isUserLoggedIn();
    expect(localStorage.getItem('token')).toBe(mockValidJwtToken);
    expect(result).toBeTrue();
  });

  it('getTokenDetails should return null if no token present', () => {
    const result = service.getTokenDetails();
    expect(localStorage.getItem('token')).toBeNull();
    expect(result).toBeNull();
  });

  it('getTokenDetails should return decoded tokenDetails if token is present', () => {
    localStorage.setItem('token', mockValidJwtToken);
    const result = service.getTokenDetails();
    expect(localStorage.getItem('token')).toBe(mockValidJwtToken);
    expect(result).not.toBeNull();
  });
});
