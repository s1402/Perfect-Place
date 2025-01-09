import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterBuyerComponent } from './register.component';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from 'src/app/common/service/shared-service';
import { RegisterService } from 'src/app/service/register.service';
import { UserTypes } from 'src/app/common/enums/User';
import { of, throwError } from 'rxjs';
import { CustomError } from 'src/app/common/enums/CustomErrors';
import { CustomValidator } from 'src/app/common/validators/CustomValidator';

describe('RegisterBuyerComponent', () => {
  let component: RegisterBuyerComponent;
  let fixture: ComponentFixture<RegisterBuyerComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let registerServiceSpy: jasmine.SpyObj<RegisterService>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let buyer = {
    name: 'shobhit',
    email: 's@gmail.com',
    password: '123456',
    phone: '1231231231',
    address: {
      street: 'street',
      city: 'city',
      state: 'state',
      postalCode: 'postalCode',
    },
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    registerServiceSpy = jasmine.createSpyObj('RegisterService', ['register']);
    sharedServiceSpy = jasmine.createSpyObj('SharedService', [
      'setRegisteredUser',
      'setIsSeller',
    ]);
    await TestBed.configureTestingModule({
      declarations: [RegisterBuyerComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: RegisterService, useValue: registerServiceSpy },
        { provide: SharedService, useValue: sharedServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not register if form is invalid', () => {
    component.form.setValue({
      name: 'shobhit',
      email: '',
      password: '123456',
      phone: '1231231231',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
      },
    });
    expect(component.form.touched).toBeFalse();
    component.register();
    expect(component.form.valid).toBeFalse();
    expect(registerServiceSpy.register).not.toHaveBeenCalled();
    expect(component.form.touched).toBeTrue();
  });

  it('should navigate to verify email on successful register', () => {
    const mockResponse = { message: 'dummy message' };
    registerServiceSpy.register.and.returnValue(of(mockResponse));
    component.form.setValue(buyer);
    component.register();
    expect(component.form.valid).toBeTrue();
    expect(registerServiceSpy.register).toHaveBeenCalled();
    expect(sharedServiceSpy.setRegisteredUser).toHaveBeenCalledWith(
      component.form.value
    );
    expect(sharedServiceSpy.setIsSeller).toHaveBeenCalledWith(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/verify-email'], {
      queryParams: { user: UserTypes.BUYER },
    });
  });

  it('should set form errors on failed register', () => {
    const mockError = { error: { error: { error: 'Invalid credentials' } } };
    registerServiceSpy.register.and.returnValue(throwError(() => mockError));
    component.form.setValue(buyer);
    component.register();
    expect(registerServiceSpy.register).toHaveBeenCalled();
    expect(component.form.errors).toEqual(mockError);
  });

  it('should log server down error if no specific error is returned', () => {
    registerServiceSpy.register.and.returnValue(
      throwError(() => new Error('Unknown error'))
    );
    component.form.setValue(buyer);
    component.register();
    expect(registerServiceSpy.register).toHaveBeenCalled();
    expect(component.form.errors).toEqual({
      error: CustomError.SERVER_IS_DOWN,
    });
  });

  it('should return { invalidPhone: true } for an invalid phone number', () => {
    const control: AbstractControl = { value: '12345abc' } as AbstractControl;
    const result = CustomValidator.phoneValidator(control);
    expect(result).toEqual({ invalidPhone: true });
  });
});
