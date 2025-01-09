import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AuthService } from 'src/app/service/auth.service';
import { SharedService } from '../../service/shared-service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router',['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService',['getTokenDetails','isUserLoggedIn']); 
    sharedServiceSpy = jasmine.createSpyObj('SharedService', ['cartItemObservable']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,TranslateModule.forRoot()],
      providers: [{ provide: AuthService , useValue: authServiceSpy },
        { provide: SharedService, useValue: sharedServiceSpy },
        { provide: Router, useValue: routerSpy}
      ],
      declarations: [ HeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to cartItemObservable and update cartCount', () => {
    sharedServiceSpy.cartItemObservable = of(3);
    fixture.detectChanges();
    expect(component.cartCount).toBe(3);
  });

  it('should display address for seller', () => {
    authServiceSpy.getTokenDetails.and.returnValue({
      isSeller: true,
      businessAddress: {
        city: 'New York',
        state: 'NY',
        postcalCode: '123123',
        street: 'Albaquergie',
      },
      email: 'hb@hotmail.com',
      name: 'heisenberg',
      iat: '12121231',
      _id: '121211',
    });
    const res = component.displayAddress();
    expect(res).toBe('New York NY');
  });

  it('should display address for buyer', () => {
    authServiceSpy.getTokenDetails.and.returnValue({
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
    });
    const res = component.displayAddress();
    expect(res).toBe('New York NY');
  });

  it('should navigate to sellers login page for seller on logout', () => {
    authServiceSpy.getTokenDetails.and.returnValue({
      isSeller: true,
      email: 'hb@hotmail.com',
      name: 'heisenberg',
      iat: '12121231',
      _id: '121211',
    });
    component.logout();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/seller/login']);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
  });

  it('should navigate to buyers login page for buyer on logout', () => {
    authServiceSpy.getTokenDetails.and.returnValue({
      isSeller: false,
      email: 'hb@hotmail.com',
      name: 'heisenberg',
      iat: '12121231',
      _id: '121211',
    });
    component.logout();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/buyer/login']);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
  });
});
