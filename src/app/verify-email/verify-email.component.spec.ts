import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { VerifyEmailComponent } from './verify-email.component';
import { RegisterService } from '../service/register.service';
import { SharedService } from '../common/service/shared-service';
import { VerifyEmailService } from '../service/verify-email.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserTypes } from '../common/enums/User';
import { of, throwError } from 'rxjs';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CustomError } from '../common/enums/CustomErrors';
import { CustomValidator } from '../common/validators/CustomValidator';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let registerServiceSpy: jasmine.SpyObj<RegisterService>;
  let verifyEmailServiceSpy: jasmine.SpyObj<VerifyEmailService>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let activatedRouterSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    verifyEmailServiceSpy = jasmine.createSpyObj('VerifyEmailService', [
      'verifyEmail',
    ]);
    registerServiceSpy = jasmine.createSpyObj('RegisterService', ['register']);
    activatedRouterSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
    sharedServiceSpy = jasmine.createSpyObj('SharedService', [
      'registeredUserObservable',
      'isSellerObservable',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [VerifyEmailComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: { get: () => UserTypes.BUYER } },
          },
        },
        { provide: RegisterService, useValue: registerServiceSpy },
        { provide: SharedService, useValue: sharedServiceSpy },
        { provide: VerifyEmailService, useValue: verifyEmailServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    sharedServiceSpy.registeredUserObservable = of({});
    sharedServiceSpy.isSellerObservable = of(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set userType based on query parameters in ngOnInit', () => {
    expect(component.userType).toBe(UserTypes.BUYER);
  });

  it('should not call verifyEmail if form is invalid', () => {
    component.form.setValue({ otp: '' });
    component.VerifyEmail();
    expect(verifyEmailServiceSpy.verifyEmail).not.toHaveBeenCalled();
  });

  it('should call verifyEmail and navigate to buyer login on success', fakeAsync(() => {
    const mockResponse = { success: true };
    verifyEmailServiceSpy.verifyEmail.and.returnValue(of(mockResponse));
    routerSpy.navigate.and.stub();

    component.form.setValue({ otp: '123456' });
    component.VerifyEmail();
    tick(2000);
    expect(verifyEmailServiceSpy.verifyEmail).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/buyer/login']);
  }));

  it('should call verifyEmail and navigate to seller login on success', fakeAsync(() => {
    const mockResponse = { success: true };
    verifyEmailServiceSpy.verifyEmail.and.returnValue(of(mockResponse));
    sharedServiceSpy.isSellerObservable = of(true);
    routerSpy.navigate.and.stub();

    component.form.setValue({ otp: '123456' });
    component.VerifyEmail();
    tick(2000);
    expect(verifyEmailServiceSpy.verifyEmail).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/seller/login']);
  }));

  it('should set form errors on verifyEmail failure', () => {
    const mockError = { error: { error: { error: 'Invalid OTP' } } };
    verifyEmailServiceSpy.verifyEmail.and.returnValue(
      throwError(() => mockError)
    );
    component.form.setValue({ otp: '123456' });
    component.VerifyEmail();
    expect(verifyEmailServiceSpy.verifyEmail).toHaveBeenCalled();
    expect(component.form.errors).toEqual(mockError);
  });

  it('should log server down error if no specific error is returned', () => {
    verifyEmailServiceSpy.verifyEmail.and.returnValue(
      throwError(() => new Error('Unknown error'))
    );
    component.form.setValue({ otp: '123456' });
    component.VerifyEmail();
    expect(verifyEmailServiceSpy.verifyEmail).toHaveBeenCalled();
    expect(component.form.errors).toEqual({
      error: CustomError.SERVER_IS_DOWN,
    });
  });

  it('should call register and show success banner on success on resend otp', fakeAsync(() => {
    registerServiceSpy.register.and.returnValue(of({ success: true }));

    component.resendOtp();
    expect(component.showOtpResendSuccess).toBeTrue();
    expect(registerServiceSpy.register).toHaveBeenCalled();
    tick(2000);
    expect(component.showOtpResendSuccess).toBeFalse();
  }));

  it('should set form errors on verifyEmail failure', () => {
    const mockError = { error: { error: { error: 'FAILED TO Resend OTP' } } };
    registerServiceSpy.register.and.returnValue(throwError(() => mockError));
    component.form.setValue({ otp: '123456' });
    component.resendOtp();
    expect(registerServiceSpy.register).toHaveBeenCalled();
    expect(component.form.errors).toEqual(mockError);
  });

  it('should log server down error if no specific error is returned', () => {
    registerServiceSpy.register.and.returnValue(
      throwError(() => new Error('Unknown error'))
    );
    component.form.setValue({ otp: '123456' });
    component.resendOtp();
    expect(registerServiceSpy.register).toHaveBeenCalled();
    expect(component.form.errors).toEqual({
      error: CustomError.SERVER_IS_DOWN,
    });
  });

  it('should return { invalidOtp: true } for an invalid OTP', () => {
    const control: AbstractControl = { value: 'abc123' } as AbstractControl;
    const result = CustomValidator.otpValidator(control);
    expect(result).toEqual({ invalidOtp: true });
  });

  it('should return { invalidEmail: true } for an invalid email', () => {
    const control: AbstractControl = { value: 'invalid-email' } as AbstractControl;
    const result = CustomValidator.emailValidator(control);
    expect(result).toEqual({ invalidEmail: true });
  });
});
