import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBuyerComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from 'src/app/service/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { CustomError } from 'src/app/common/enums/CustomErrors';

describe('LoginBuyerComponent', () => {
  let component: LoginBuyerComponent;
  let fixture: ComponentFixture<LoginBuyerComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let loggerSpy: jasmine.SpyObj<NGXLogger>;

  beforeEach(async () => {
    loggerSpy = jasmine.createSpyObj('NGXLogger', ['info', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isUserLoggedIn',
      'login',
    ]);

    await TestBed.configureTestingModule({
      declarations: [LoginBuyerComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NGXLogger, useValue: loggerSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginBuyerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove  token from localstorage in ngOnInit if user is  logged in', () => {
    localStorage.setItem('token','mockToken');
    authServiceSpy.isUserLoggedIn.and.returnValue(true);
    fixture.detectChanges();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should not login if form is invalid', () => {
    component.form.setValue({ email: '', password: '123456' });
    expect(component.form.touched).toBeFalse();
    component.login();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(component.form.touched).toBeTrue();
  });

  it('should navigate to buyer home on successful login', () => {
    const mockResponse = { token: 'dummy-token' };
    authServiceSpy.login.and.returnValue(of(mockResponse));
    component.form.setValue({ email: 'test@example.com', password: '123456' });
    component.login();
    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(loggerSpy.info).toHaveBeenCalledWith('Login Success!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/buyer/home']);
  });

  it('should log error and set form errors on failed login', () => {
    const mockError = { error: { error: 'Invalid credentials' } };
    authServiceSpy.login.and.returnValue(throwError(() => mockError));
    component.form.setValue({ email: 'test@example.com', password: 'wrong-password' });
    component.login();
    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(loggerSpy.error).toHaveBeenCalledWith('Login failed!');
    expect(component.form.errors).toEqual(mockError.error);
  });

  it('should log server down error if no specific error is returned', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Unknown error')));
    component.form.setValue({ email: 'test@example.com', password: 'wrong-password' });
    component.login();
    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(loggerSpy.error).toHaveBeenCalledWith('Login failed!');
    expect(component.form.errors).toEqual({ error: CustomError.SERVER_IS_DOWN });
  });
});
