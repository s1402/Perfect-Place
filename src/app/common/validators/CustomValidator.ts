import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidator {
  static otpValidator(control: AbstractControl): ValidationErrors | null {
    let otp: string = control.value;
    const validOtpRegex = /^\d{6}$/;
    if (otp && !validOtpRegex.test(otp)) {
      return { invalidOtp: true };
    }
    return null;
  }

  static emailValidator(control: AbstractControl): ValidationErrors | null {
    let email: string = control.value;
    const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !validEmailRegex.test(email)) {
      return { invalidEmail: true };
    }
    return null;
  }

  static phoneValidator(control: AbstractControl): ValidationErrors | null {
    let phone: string = control.value;
    const validPhoneRegex = /^\d{10}$/;
    if (phone && !validPhoneRegex.test(phone)) {
      return { invalidPhone: true };
    }
    return null;
  }
}
