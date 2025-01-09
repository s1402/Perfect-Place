import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyProductsComponent } from './my-products.component';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/common/component/header/header.component';
import {
  Product,
  ProductCategory,
} from 'src/app/common/enums/Products';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { of, throwError } from 'rxjs';
import { CustomError } from 'src/app/common/enums/CustomErrors';

describe('MyProductsComponent', () => {
  let component: MyProductsComponent;
  let fixture: ComponentFixture<MyProductsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let mockAuthTokenDetails: any;
  let mockResponse: any;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getTokenDetails',
      'isUserLoggedIn',
    ]);
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProductsBySeller',
    ]);
    mockAuthTokenDetails = { _id: 'mockSellerId' };
    mockResponse = [
      {
        name: 'tshirt',
        description: '100 % cotton',
        price: '300',
        stock: 20,
        category: ProductCategory.MEN,
        images: [{ url: '', altText: '' }],
        sellerId: 'sellerId',
        currentIndex: 0,
      },
    ];

    await TestBed.configureTestingModule({
      declarations: [MyProductsComponent, HeaderComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProductService, useValue: productServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the next image', () => {
    const product: Product = {
      images: [{ url: 'url1', altText: 'altText1' }],
      currentIndex: undefined,
    };
    component.nextImage(product);
    expect(product.currentIndex).toBe(0);
  });

  it('should navigate to the prev image', () => {
    const product: Product = {
      images: [{ url: 'url1', altText: 'altText1' }],
      currentIndex: undefined,
    };
    component.prevImage(product);
    expect(product.currentIndex).toBe(0);
  });

  it('should fetch orders for the seller if sellerId exists on ngOnInit', () => {
    authServiceSpy.getTokenDetails.and.returnValue(mockAuthTokenDetails);
    productServiceSpy.getProductsBySeller.and.returnValue(of(mockResponse));
    component.ngOnInit();
    expect(productServiceSpy.getProductsBySeller).toHaveBeenCalledWith(
      'mockSellerId'
    );
    expect(component.products).toEqual(mockResponse);
  });

  it('should log an error if fetching orders fails on ngOnInit', () => {
    authServiceSpy.getTokenDetails.and.returnValue(mockAuthTokenDetails);
    productServiceSpy.getProductsBySeller.and.returnValue(
      throwError(() => 'Fetch error')
    );
    component.ngOnInit();
    expect(component.errorMessage).toBe('Fetch error');
    expect(productServiceSpy.getProductsBySeller).toHaveBeenCalledWith(
      'mockSellerId'
    );
  });

  it('should log an error if fetching orders fails on ngOnInit', () => {
    authServiceSpy.getTokenDetails.and.returnValue(mockAuthTokenDetails);
    productServiceSpy.getProductsBySeller.and.returnValue(
      throwError(() => undefined)
    );
    component.ngOnInit();
    expect(component.errorMessage).toBe(CustomError.SERVER_IS_DOWN);
    expect(productServiceSpy.getProductsBySeller).toHaveBeenCalledWith(
      'mockSellerId'
    );
  });
});
