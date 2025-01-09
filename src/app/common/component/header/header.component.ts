import { AuthService } from 'src/app/service/auth.service';
import { SharedService } from '../../service/shared-service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public sharedService: SharedService,
    private readonly router: Router
  ) {}

  cartCount = 0;

  ngOnInit(): void {
    this.sharedService.cartItemObservable.subscribe((count) => {
      this.cartCount = count;
    });
  }

  displayAddress(): string {
    if (this.authService.getTokenDetails()?.isSeller) {
      return (
        this.authService.getTokenDetails()?.businessAddress?.city +
        ' ' +
        this.authService.getTokenDetails()?.businessAddress?.state
      );
    }
    return (
      this.authService.getTokenDetails()?.address?.city +
      ' ' +
      this.authService.getTokenDetails()?.address?.state
    );
  }

  logout(): void {
    if (this.authService.getTokenDetails()?.isSeller) {
      this.router.navigate(['/seller/login']);
    } else {
      this.router.navigate(['/buyer/login']);
    }
  }
}
