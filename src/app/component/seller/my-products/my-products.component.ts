import { ProductService } from 'src/app/service/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/enums/Products';
import { AuthService } from 'src/app/service/auth.service';
import { CustomError } from 'src/app/common/enums/CustomErrors';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss'],
})
export class MyProductsComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const sellerId = this.authService.getTokenDetails()?._id;
    if (!sellerId) {
      return;
    }
    this.productService.getProductsBySeller(sellerId).subscribe({
      next: (response: any) => {
        if (response) {
          this.products = response.map((product: Product) => ({
            ...product,
            currentIndex: 0,
          }));
        }
      },
      error: (err) => {
        if (err) {
          this.errorMessage = err;
        } else {
          this.errorMessage = CustomError.SERVER_IS_DOWN;
        }
      },
    });
  }

  nextImage(product: Product) {
    product.currentIndex =
      ((product.currentIndex || 0) + 1) % product.images.length;
  }

  prevImage(product: Product) {
    product.currentIndex =
      ((product.currentIndex || 0) - 1 + product.images.length) %
      product.images.length;
  }
}
