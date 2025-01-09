import { RegisterService } from '../service/register.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyEmailService } from '../service/verify-email.service';
import { CustomError } from '../common/enums/CustomErrors';
import { User, UserDetails, UserTypes } from '../common/enums/User';
import { CustomValidator } from '../common/validators/CustomValidator';
import { SharedService } from '../common/service/shared-service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  constructor(
    private router: Router,
    private verifyEmailService: VerifyEmailService,
    public registerService: RegisterService,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) {}

  showSuccessBanner = false;
  showOtpResendSuccess = false;
  userType = UserTypes.BUYER;

  ngOnInit(): void {
    this.userType = this.route.snapshot.queryParamMap.get('user') as UserTypes;
  }

  form: FormGroup = new FormGroup({
    otp: new FormControl('', [
      Validators.required,
      CustomValidator.otpValidator,
    ]),
  });

  VerifyEmail(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    // create the user obj with OTP
    let user: UserDetails = {};
    let isSeller = false;
    this.sharedService.registeredUserObservable.subscribe((userObject: any) => {
        user = userObject;
    })

    this.sharedService.isSellerObservable.subscribe((isSellerBoolean: boolean) => {
      isSeller = isSellerBoolean;
    });

    user.otp = this.otp?.value;
    this.verifyEmailService
      .verifyEmail(user, this.userType === UserTypes.SELLER)
      .subscribe({
        next: (response) => {
          if (response) {
            this.showSuccessBanner = true;
            setTimeout(() => {
              this.showSuccessBanner = false;
              isSeller
                ? this.router.navigate(['/seller/login'])
                : this.router.navigate(['/buyer/login']);
            }, 2000);
          }
        },
        error: (response) => {
          if (response && response.error && response.error['error']) {
            this.form.setErrors(response);
          } else {
            this.form.setErrors({ error: CustomError.SERVER_IS_DOWN });
          }
        },
      });
  }

  resendOtp(): void {
    let user: UserDetails = {};
    let isSeller = false;
    this.sharedService.registeredUserObservable.subscribe((userObject: any) => {
        user = userObject;
    })

    this.sharedService.isSellerObservable.subscribe((isSellerBoolean: boolean) => {
      isSeller = isSellerBoolean;
    });
    
    this.registerService.register(user,isSeller).subscribe({
      next: (response) => {
        if (response) {
          this.showOtpResendSuccess = true;
          setTimeout(() => {
            this.showOtpResendSuccess = false;
          }, 2000);
        }
      },
      error: (response) => {
        if (response && response.error && response.error['error']) {
          this.form.setErrors(response);
        } else {
          this.form.setErrors({ error: CustomError.SERVER_IS_DOWN });
        }
      },
    });
  }

  get otp() {
    return this.form.get('otp');
  }
}
