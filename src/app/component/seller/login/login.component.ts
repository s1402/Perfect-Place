import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/common/enums/User';
import { CustomError } from 'src/app/common/enums/CustomErrors';
import { SharedService } from 'src/app/common/service/shared-service';
import { CustomValidator } from 'src/app/common/validators/CustomValidator';
import { AuthService } from 'src/app/service/auth.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-seller-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginSellerComponent {

  constructor(private router: Router,private authService: AuthService,private readonly logger: NGXLogger){}

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      localStorage.removeItem('token')
    }
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.required,CustomValidator.emailValidator]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  
  login(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const seller= this.form.value as User;
    this.authService.login(seller,true).subscribe({
      next : (response) => {
        if(response){
          this.logger.info("Login Success!")
          this.router.navigate(['/seller/home']);
        }
      },
      error : (response) => {
        this.logger.error("Login Failed!")
        if(response && response.error && response.error['error']){
          this.form.setErrors(response.error);
        }
        else{
          this.form.setErrors({'error': CustomError.SERVER_IS_DOWN})
        }
      }
    });

  }

  get email(){
    return this.form.get('email');
  }

  get password(){
    return this.form.get('password');
  }
}
