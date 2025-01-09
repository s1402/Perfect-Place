import { RegisterService } from '../../../service/register.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomError } from '../../../common/enums/CustomErrors';
import { CustomValidator } from '../../../common/validators/CustomValidator';
import { User, UserTypes } from '../../../common/enums/User';
import { SharedService } from 'src/app/common/service/shared-service';

@Component({
  selector: 'app-buyer-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterBuyerComponent {

  form: FormGroup;
  constructor(private router: Router,private registerService: RegisterService, 
    private fb: FormBuilder,private sharedService:SharedService){
    this.form = this.fb.group({
      name : ["",Validators.required],
      email : ["",[Validators.required,CustomValidator.emailValidator]],
      password: ["",[Validators.required,Validators.minLength(6)]],
      phone: ["",[Validators.required,CustomValidator.phoneValidator]],
      address: this.fb.group({
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
    const buyer: User = this.form.value;
    this.registerService.register(buyer,false).subscribe({
      next: ((response) => {
        if (response) {
          this.sharedService.setRegisteredUser(buyer);
          this.sharedService.setIsSeller(false);
            this.router.navigate(['/verify-email'],{queryParams:{ user : UserTypes.BUYER }});
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
    return this.form.get('address.street');
  }

  get city(){
    return this.form.get('address.city');
  }

  get state(){
    return this.form.get('address.state');
  }

  get postalCode(){
    return this.form.get('address.postalCode');
  }
}
