import { SharedService } from 'src/app/common/service/shared-service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBuyerComponent } from './home.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';
import { NGXLogger } from 'ngx-logger';
import { HeaderComponent } from 'src/app/common/component/header/header.component';
import { of, throwError } from 'rxjs';
import { ProductCategory, ProductDetails } from 'src/app/common/enums/Products';
import { CustomError } from 'src/app/common/enums/CustomErrors';

describe('HomeBuyerComponent', () => {
  let component: HomeBuyerComponent;
  let fixture: ComponentFixture<HomeBuyerComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let loggerSpy: jasmine.SpyObj<NGXLogger>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getAllProducts',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isUserLoggedIn',
      'getTokenDetails',
    ]);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    sharedServiceSpy = jasmine.createSpyObj('SharedService', [
      'incrementCartItemCount',
    ]);
    loggerSpy = jasmine.createSpyObj('NGXLogger', ['log', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    productServiceSpy.getAllProducts.and.returnValue(
      of([{ _id: '1', name: 'Test Product' }])
    );

    await TestBed.configureTestingModule({
      declarations: [HomeBuyerComponent, HeaderComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: SharedService, useValue: sharedServiceSpy },
        { provide: NGXLogger, useValue: loggerSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeBuyerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and set products on success in ngOnInit', () => {
    const mockProducts = [
      { _id: '1', category: ProductCategory.MEN, images: [{}] },
      { _id: '2', category: ProductCategory.WOMEN, images: [{}] },
    ];
    productServiceSpy.getAllProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();
    expect(productServiceSpy.getAllProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should log error if fetching products fails in ngOnInit', () => {
    productServiceSpy.getAllProducts.and.returnValue(
      throwError(() => new Error('Error fetching products'))
    );
    component.ngOnInit();
    expect(loggerSpy.error).toHaveBeenCalledWith(
      'Error fetching products:',
      jasmine.any(Error)
    );
  });

  it('should navigate to the next image', () => {
    const product: ProductDetails = {
      images: [{ url: 'url1', altText: 'altText1' }],
      currentIndex: undefined,
    };
    component.nextImage(product);

    expect(product.currentIndex).toBe(0);
  });

  it('should navigate to the prev image', () => {
    const product: ProductDetails = {
      images: [{ url: 'url1', altText: 'altText1' }],
      currentIndex: undefined,
    };
    component.prevImage(product);

    expect(product.currentIndex).toBe(0);
  });

  it('should increment quantity if in stock', () => {
    const product: ProductDetails = {
      stock: 10,
      quantity: 5,
      images: [{ url: 'url1', altText: 'altText1' }],
    };
    component.increaseQuantity(product);

    expect(product.quantity).toBe(6);
    expect(component.outOfStockErrorBanner).toBeFalse();
  });

  it('should show outOfStockErrorBanner for 1 second if product stock is less than or equal to quantity', () => {
    const product: ProductDetails = {
      stock: 5,
      quantity: 5,
      images: [{ url: 'url1', altText: 'altText1' }],
    };
    jasmine.clock().install();
    component.increaseQuantity(product);
    expect(component.outOfStockErrorBanner).toBeTrue();
    jasmine.clock().tick(1000);
    expect(component.outOfStockErrorBanner).toBeFalse();
    jasmine.clock().uninstall();
    expect(product.quantity).toBe(5);
  });

  it('should decrement quantity if greater than 1', () => {
    const product: ProductDetails = {
      stock: 10,
      quantity: 5,
      images: [{ url: 'url1', altText: 'altText1' }],
    };
    component.decreaseQuantity(product);

    expect(product.quantity).toBe(4);
  });

  it('should filter products by MEN category', () => {
    component.products = [
      {
        category: ProductCategory.MEN,
        images: [{ url: 'url1', altText: 'altText1' }],
      },
      {
        category: ProductCategory.WOMEN,
        images: [{ url: 'url2', altText: 'altText2' }],
      },
    ];

    component.filterByCategory(ProductCategory.MEN);

    expect(component.filteredProducts.length).toBe(1);
  });

  it('should select all products when category is ALL', () => {
    component.products = [
      {
        category: ProductCategory.MEN,
        images: [{ url: 'url1', altText: 'altText1' }],
      },
      {
        category: ProductCategory.WOMEN,
        images: [{ url: 'url2', altText: 'altText2' }],
      },
    ];
    component.filterByCategory(ProductCategory.ALL);
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should add product to cart if user is logged in and not a seller', () => {
    authServiceSpy.isUserLoggedIn.and.returnValue(true);
    authServiceSpy.getTokenDetails.and.returnValue({
      isSeller: false,
      email: 'hb@hotmail.com',
      name: 'heisenberg',
      iat: '12121231',
      _id: '121211',
    });

    cartServiceSpy.addToCart.and.returnValue(of(true));
    component.addToCart({
      _id: 'product1',
      quantity: 2,
      images: [{ url: 'url2', altText: 'altText2' }],
    });
    expect(cartServiceSpy.addToCart).toHaveBeenCalled();
    expect(sharedServiceSpy.incrementCartItemCount).toHaveBeenCalled();
    expect(component.showSuccessBanner).toBeTrue();
  });

  it('should navigate to login if user is not logged in', () => {
    authServiceSpy.isUserLoggedIn.and.returnValue(false);
    jasmine.clock().install();
    component.addToCart({
      _id: 'product1',
      quantity: 2,
      images: [{ url: 'url2', altText: 'altText2' }],
    });
    expect(component.showLoginBanner).toBeTrue();
    jasmine.clock().tick(1000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/buyer/login']);
    expect(component.showLoginBanner).toBeFalse();
    jasmine.clock().uninstall();
  });

  it('should show error banner if known error is thrown from BE on adding product to cart', () => {
    authServiceSpy.isUserLoggedIn.and.returnValue(true);
    authServiceSpy.getTokenDetails.and.returnValue({
      isSeller: false,
      email: 'hb@hotmail.com',
      name: 'heisenberg',
      iat: '12121231',
      _id: '121211',
    });
    const mockErrorResponse = {
      status: 400,
      statusText: 'Unauthorized',
      error: { error: 'Error adding Products' },
    };
    cartServiceSpy.addToCart.and.returnValue(
      throwError(() => mockErrorResponse)
    );
    jasmine.clock().install();
    component.addToCart({images: [{ url: 'url2', altText: 'altText2' }]});
    expect(component.productAlreadyInCartErrorBanner).toBeTrue();
    jasmine.clock().tick(1000);
    expect(component.productAlreadyInCartErrorBanner).toBeFalse();
    jasmine.clock().uninstall();
  });

  it('should log the error if server is down', () => {
    authServiceSpy.isUserLoggedIn.and.returnValue(true);
    authServiceSpy.getTokenDetails.and.returnValue({
      isSeller: false,
      email: 'hb@hotmail.com',
      name: 'heisenberg',
      iat: '12121231',
      _id: '121211',
    });
    cartServiceSpy.addToCart.and.returnValue(
      throwError(() => new Error('Server is down'))
    );
    component.addToCart({images: [{ url: 'url2', altText: 'altText2' }]});
    expect(loggerSpy.error).toHaveBeenCalledWith({error: CustomError.SERVER_IS_DOWN } );
  });
});
