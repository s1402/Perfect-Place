import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomError } from 'src/app/common/enums/CustomErrors';
import { User, UserTypes } from 'src/app/common/enums/User';
import { SharedService } from 'src/app/common/service/shared-service';
import { CustomValidator } from 'src/app/common/validators/CustomValidator';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-seller-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterSellerComponent {
  form: FormGroup;
  constructor(private router: Router,private registerService: RegisterService,
     private fb: FormBuilder, private sharedService: SharedService){
    this.form = this.fb.group({
      name : ["",Validators.required],
      email : ["",[Validators.required,CustomValidator.emailValidator]],
      password: ["",[Validators.required,Validators.minLength(6)]],
      phone: ["",[Validators.required,CustomValidator.phoneValidator]],
      businessName : ["",Validators.required],
      businessAddress: this.fb.group({
        street: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
        city: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
        state: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
        postalCode: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(20)]]
      })
    })
  }

  register(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const seller: User = this.form.value;
    this.registerService.register(seller,true).subscribe({
      next: ((response) => {
        if (response) {
            this.sharedService.setRegisteredUser(seller);
            this.sharedService.setIsSeller(true);
            this.router.navigate(['/verify-email'],{queryParams:{ user : UserTypes.SELLER }});
        }
      }),
      error: (response) => {
        if (response && response.error && response.error['error']) {
          this.form.setErrors(response);
        }
        else {
          this.form.setErrors({ "error": CustomError.SERVER_IS_DOWN });
        }
      }
    })
  }

  get name(){
    return this.form.get('name');
  }

  get businessName(){
    return this.form.get('name');
  }

  get email(){
    return this.form.get('email');
  }

  get password(){
    return this.form.get('password');
  }

  get phone(){
    return this.form.get('phone');
  }

  get street(){
    return this.form.get('businessAddress.street');
  }

  get city(){
    return this.form.get('businessAddress.city');
  }

  get state(){
    return this.form.get('businessAddress.state');
  }

  get postalCode(){
    return this.form.get('businessAddress.postalCode');
  }
}
