import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { CustomError } from 'src/app/common/enums/CustomErrors';
import {
  ProductCategory,
  ProductDetails,
} from 'src/app/common/enums/Products';
import { SharedService } from 'src/app/common/service/shared-service';
import { AuthService } from 'src/app/service/auth.service';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-buyer-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeBuyerComponent implements OnInit {
  products: ProductDetails[] = [];
  filteredProducts: ProductDetails[] = [];
  errorMessage: string = '';
  categories: ProductCategory[] = [
    ProductCategory.ALL,
    ProductCategory.MEN,
    ProductCategory.WOMEN,
    ProductCategory.CHILDREN,
  ];
  showLoginBanner = false;
  showSuccessBanner = false;
  productAlreadyInCartErrorBanner = false;
  outOfStockErrorBanner = false;
  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cartService: CartService,
    private readonly sharedService: SharedService,
    private readonly logger: NGXLogger
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next : (response: any) => {
        this.products = response.map((product: any) => ({
          ...product,
          currentIndex: 0,
          quantity: 1,
        }));
        this.filteredProducts = [...this.products];
    }, 
      error : (error) => {
        this.logger.error('Error fetching products:', error);
      }
  });
    this.filteredProducts = [...this.products];
  }

  nextImage(product: ProductDetails): void {
    product.currentIndex =
      ((product.currentIndex || 0) + 1) % product.images.length;
  }

  prevImage(product: ProductDetails): void {
    product.currentIndex =
      ((product.currentIndex || 0) - 1 + product.images.length) %
      product.images.length;
  }

  increaseQuantity(product: ProductDetails): void {
    if(product.stock && product.quantity && product.stock <= product.quantity){
      this.outOfStockErrorBanner =true;
      setTimeout(()=>{
        this.outOfStockErrorBanner = false;
      },1000);
      return;
    }
    product.quantity = (product.quantity || 0) + 1;
  }

  decreaseQuantity(product: ProductDetails): void {
    if (product.quantity && product.quantity > 1) {
      product.quantity--;
    }
  }

  filterByCategory(category: ProductCategory): void {
    if (category === ProductCategory.ALL) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        (product) => product.category === category
      );
    }
  }

  addToCart(product: ProductDetails): void {
    if ( this.authService.isUserLoggedIn() && !this.authService.getTokenDetails()?.isSeller ) {
      this.cartService
        .addToCart({
          buyerId: this.authService.getTokenDetails()?._id,
          productId: product._id,
          quantity: product.quantity,
        })
        .subscribe({
          next: (response) => {
            if (response) {
              this.sharedService.incrementCartItemCount();
              this.logger.log('Adding Item to cart...')
              this.showSuccessBanner = true;
              setTimeout(() => {
                this.showSuccessBanner = false;
              }, 1000);
            }
          },
          error: (response) => {
            if (response && response.error && response.error['error']) {
              this.productAlreadyInCartErrorBanner = true;
              setTimeout(() => {
                this.productAlreadyInCartErrorBanner = false;
              }, 1000);
            } else {
              this.logger.error({ error: CustomError.SERVER_IS_DOWN });
            }
          },
        });
    } else {
      // navigate to buyer login page
      this.showLoginBanner = true;
      setTimeout(() => {
        this.showLoginBanner = false;
        this.router.navigate(['/buyer/login']);
      }, 1000);
    }
  }
}
