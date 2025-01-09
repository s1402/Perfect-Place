import { OrderService } from 'src/app/service/order.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Orders } from 'src/app/common/enums/Order';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-seller-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeSellerComponent implements OnInit {
  constructor(
    private readonly logger: NGXLogger,
    private readonly authService: AuthService,
    private readonly orderService: OrderService
  ) {}

  orders: Orders[] = [];
  validStatuses = [
    'Order Recieved',
    'Order Shipped',
    'Order on the way to destination',
    'Order Delivered!🥳',
  ];
  showSuccessBanner = false;

  ngOnInit(): void {
    const sellerId = this.authService.getTokenDetails()?._id;
    if (sellerId) {
      this.orderService.getMyOrdersSeller(sellerId).subscribe({
        next: (response: any) => {
          this.orders = response;
        },
        error: (response) => {
          this.logger.error('Failed to fetch orders.', response);
        },
      });
    }
  }

  updateOrderStatus(orderId: string, orderStatus: string): void {
    this.orderService.updateOrderStatus(orderId, orderStatus).subscribe({
      next: (response: any) => {
        if (response) {
          this.showSuccessBanner = true;
          this.logger.log('Order status updated succesfuly');
          setTimeout(() => {
            this.showSuccessBanner = false;
          }, 2000);
        } else {
          this.logger.error('Failed to update order status.');
        }
      },
      error: (response) => {
        this.logger.error('Failed to update order status.', response);
      },
    });
  }

  calculateTotalPrice(): number {
    return this.orders
      .map((order) => order.totalPrice)
      .reduce((acc, curr) => acc + curr, 0);
  }
}
