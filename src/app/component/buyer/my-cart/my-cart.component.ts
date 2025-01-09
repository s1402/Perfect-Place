import { SharedService } from 'src/app/common/service/shared-service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { CartItem } from 'src/app/common/enums/Cart';
import { AuthService } from 'src/app/service/auth.service';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss'],
})
export class MyCartComponent {
  cartItems: CartItem[] = [];
  showItemRemovedMessage = false;
  showSuccessBanner = false;
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private logger: NGXLogger,
    private readonly router: Router,
    private readonly sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const buyerId = this.authService.getTokenDetails()?._id;
    if (buyerId) {
      this.cartService.getCartDetails(buyerId).subscribe({
        next: (cart: any) => {
          this.cartItems = cart;
        },
        error: (err) => {
          this.logger.error('Error fetching cart details', err);
        },
      });
    }
  }

  removeFromCart(productId: any) {
    const buyerId = this.authService.getTokenDetails()?._id;
    if (buyerId) {
      this.cartService.removeFromCart(buyerId, productId).subscribe({
        next: () => {
          this.sharedService.decrementCartItemCount();
          this.logger.log('Removing Item from cart...');
          this.showItemRemovedMessage = true;
          setTimeout(() => {
            this.showItemRemovedMessage = false;
            this.cartItems = this.cartItems.filter(
              (item) => item.productId?._id !== productId
            );
          }, 1000);
        },
        error: (err) => {
          this.logger.error('Error removing product from cart', err);
        },
      });
    }
  }

  buyNow() {
    const products = this.cartItems.map((cartItem: CartItem) => ({
      productId: cartItem.productId._id,
      quantity: cartItem.quantity,
    }));

    this.orderService
      .buyNow({
        buyerId: this.authService.getTokenDetails()?._id,
        products,
      })
      .subscribe({
        next: () => {
          this.logger.log('Items purchased successfuly!');
          this.sharedService.setCartCount(0);
          this.showSuccessBanner = true;
          setTimeout(() => {
            this.showSuccessBanner = false;
            this.router.navigate(['/buyer/home']);
          }, 1000);
        },
        error: (response) => {
          this.logger.error('Failed to purchase items', response);
        },
      });
  }
}
