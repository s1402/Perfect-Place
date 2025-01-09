import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Orders } from 'src/app/common/enums/Order';
import { AuthService } from 'src/app/service/auth.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private logger: NGXLogger
  ) {}

  orders: Orders[] = [];

  ngOnInit(): void {
    let buyerId = this.authService.getTokenDetails()?._id;
    if (buyerId) {
      this.orderService.getMyOrdersBuyer(buyerId).subscribe({
        next: (response: any) => {
          this.orders = response;
        },
        error: () => {
          this.logger.error('Failed to fetch orders.');
        },
      });
    }
  }
}
