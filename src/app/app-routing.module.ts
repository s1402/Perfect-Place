import { HomeSellerComponent } from './component/seller/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeBuyerComponent } from './component/buyer/home/home.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { LoginBuyerComponent } from './component/buyer/login/login.component';
import { RegisterBuyerComponent } from './component/buyer/register/register.component';
import { LoginSellerComponent } from './component/seller/login/login.component';
import { RegisterSellerComponent } from './component/seller/register/register.component';
import { AddProductsComponent } from './component/seller/add-products/add-products.component';
import { MyProductsComponent } from './component/seller/my-products/my-products.component';
import { MyCartComponent } from './component/buyer/my-cart/my-cart.component';
import { MyOrdersComponent } from './component/buyer/my-orders/my-orders.component';
import { SellerGuard } from './guards/seller.guard';
import { BuyerGuard } from './guards/buyer.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeBuyerComponent,
  },
  {
    path: 'buyer/home',
    component: HomeBuyerComponent,
    canActivate: [BuyerGuard],
  },
  {
    path: 'buyer/login',
    component: LoginBuyerComponent,
  },
  {
    path: 'buyer/register',
    component: RegisterBuyerComponent,
  },
  {
    path: 'buyer/my-cart',
    component: MyCartComponent,
    canActivate: [BuyerGuard],
  },
  {
    path: 'buyer/my-orders',
    component: MyOrdersComponent,
    canActivate: [BuyerGuard],
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
  },
  {
    path: 'seller/home',
    component: HomeSellerComponent,
    canActivate: [SellerGuard],
  },
  {
    path: 'seller/login',
    component: LoginSellerComponent,
  },
  {
    path: 'seller/register',
    component: RegisterSellerComponent,
  },
  {
    path: 'seller/add-products',
    component: AddProductsComponent,
    canActivate: [SellerGuard],
  },
  {
    path: 'seller/my-products',
    component: MyProductsComponent,
    canActivate: [SellerGuard],
  },
  {
    path: '**',
    component: LoginBuyerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
