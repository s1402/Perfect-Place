import { CustomValidator } from '../../../common/validators/CustomValidator';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { CustomError } from '../../../common/enums/CustomErrors';
import { User } from '../../../common/enums/User';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-seller-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginBuyerComponent implements OnInit {

  constructor(private router: Router,private authService: AuthService,private logger: NGXLogger){}

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
    const buyer = this.form.value as User;
    this.authService.login(buyer).subscribe({
      next : (response) => {
        if(response){
          this.logger.info("Login Success!")
          this.router.navigate(['/buyer/home']);
        }
      },
      error : (response) => {
        this.logger.error("Login failed!")
        if(response && response.error && response.error['error']){
          this.form.setErrors(response.error);
        }
        else {
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
