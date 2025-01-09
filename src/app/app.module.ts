import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/component/header/header.component';
import { FooterComponent } from './common/component/footer/footer.component';
import { HomeBuyerComponent } from './component/buyer/home/home.component';
import { LoginBuyerComponent } from './component/buyer/login/login.component';
import { RegisterBuyerComponent } from './component/buyer/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RegisterSellerComponent } from './component/seller/register/register.component';
import { LoginSellerComponent } from './component/seller/login/login.component';
import { HomeSellerComponent } from './component/seller/home/home.component';
import { AddProductsComponent } from './component/seller/add-products/add-products.component';
import { MyProductsComponent } from './component/seller/my-products/my-products.component';
import { MyCartComponent } from './component/buyer/my-cart/my-cart.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MyOrdersComponent } from './component/buyer/my-orders/my-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeBuyerComponent,
    LoginBuyerComponent,
    RegisterBuyerComponent,
    RegisterSellerComponent,
    LoginSellerComponent,
    VerifyEmailComponent,
    HomeSellerComponent,
    AddProductsComponent,
    MyProductsComponent,
    MyCartComponent,
    MyOrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory:HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
      disableConsoleLogging: false,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http:HttpClient): TranslateHttpLoader{
  return new TranslateHttpLoader(http,'../assets/i18n/','-lang.json');
}