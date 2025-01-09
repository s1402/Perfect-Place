import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AddProductsComponent } from './add-products.component';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/common/component/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomError } from 'src/app/common/enums/CustomErrors';
import { of, throwError } from 'rxjs';
import { Product, ProductCategory } from 'src/app/common/enums/Products';

describe('AddProductsComponent', () => {
  let component: AddProductsComponent;
  let fixture: ComponentFixture<AddProductsComponent>;
  let loggerSpy: jasmine.SpyObj<NGXLogger>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockAuthTokenDetails: any;
  let mockProduct: Product;
  let mockResponse: any;

  beforeEach(async () => {
    loggerSpy = jasmine.createSpyObj('NGXLogger', ['log', 'error']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getTokenDetails',
      'isUserLoggedIn',
    ]);
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'uploadImage',
      'addProduct',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [AddProductsComponent, HeaderComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: NGXLogger, useValue: loggerSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    mockAuthTokenDetails = { _id: 'mockSellerId' };
    authServiceSpy.getTokenDetails.and.returnValue(mockAuthTokenDetails);

    mockProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: '100',
      category: ProductCategory.ALL,
      images: [{ url: 'mockUrl', altText: 'Test Image' }],
      stock: 9,
    };

    mockResponse = { message: 'success' };
    productServiceSpy.addProduct.and.returnValue(of(mockResponse));

    fixture = TestBed.createComponent(AddProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new image group when uploadedImages count matches images length', () => {
    component.uploadedImages.push({ url: 'mockUrl', altText: 'Product image' });
    component.addImage();
    expect(component.images.length).toBe(2);
  });

  it('should set an error if uploadedImages count does not match images length', () => {
    component.uploadedImages = [];
    component.addImage();

    expect(component.images.errors).toEqual({
      error: CustomError.INVALID_FILE_UPLOAD,
    });
    expect(component.images.length).toBe(1);
  });

  it('should remove the specified image group', () => {
    component.uploadedImages.push({
      url: 'mockUrl1',
      altText: 'Product image',
    });
    component.images.push(component.createImageGroup());
    component.removeImage(0);
    expect(component.images.length).toBe(1);
    expect(component.uploadedImages.length).toBe(0);
  });

  it('should reset to a single empty group if removing the last remaining group', () => {
    component.removeImage(0);
    expect(component.images.length).toBe(1);

    expect(component.images.at(0).value).toEqual({
      url: '',
      altText: 'Product image',
    });
  });

  it('should set an error on submitForm if no images are uploaded', () => {
    component.uploadedImages = [];
    component.submitForm();

    expect(component.images.errors).toEqual({
      error: CustomError.UPLOAD_AT_LEAST_ONE_IMAGE,
    });
    expect(productServiceSpy.addProduct).not.toHaveBeenCalled();
  });

  it('should return if form is invalid', () => {
    mockProduct = {
      name: '',
      description: 'Test Description',
      price: '100',
      category: ProductCategory.ALL,
      images: [{ url: 'mockUrl', altText: 'Test Image' }],
      stock: 9,
    };
    component.uploadedImages = [{ url: 'url', altText: 'a' }];
    component.form.setValue(mockProduct);
    component.submitForm();
    expect(component.form.invalid).toBeTrue();
    expect(productServiceSpy.addProduct).not.toHaveBeenCalled();
  });

  it('should navigate to seller home on successful product addition', fakeAsync(() => {
    component.uploadedImages = [{ url: 'mockUrl', altText: 'Product image' }];
    component.form.patchValue({
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      category: 'Electronics',
      images: [{ url: 'mockUrl', altText: 'Product image' }],
    });
    component.submitForm();
    expect(component.showSuccessBanner).toBeTrue();
    tick(2000);
    expect(component.showSuccessBanner).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/seller/home']);
  }));

    it('should log error and set form errors on failed addition of products', () => {
      component.uploadedImages = [{ url: 'mockUrl', altText: 'Product image' }];
      const mockError = { error: { error: 'Invalid credentials' } };
      productServiceSpy.addProduct.and.returnValue(throwError(() => mockError));
      component.form.patchValue({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        category: 'Electronics',
        images: [{ url: 'mockUrl', altText: 'Product image' }],
      });
      component.submitForm()
      expect(productServiceSpy.addProduct).toHaveBeenCalled();
      expect(component.form.errors).toEqual(mockError);
    });
  
    it('should log server down error if no specific error is returned', () => {
      component.uploadedImages = [{ url: 'mockUrl', altText: 'Product image' }];
      productServiceSpy.addProduct.and.returnValue(throwError(() => new Error('Unknown error')));
      component.form.patchValue({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        category: 'Electronics',
        images: [{ url: 'mockUrl', altText: 'Product image' }],
      });
      component.submitForm()
      expect(productServiceSpy.addProduct).toHaveBeenCalled();
      expect(component.form.errors).toEqual({ error: CustomError.SERVER_IS_DOWN });
    });
});
