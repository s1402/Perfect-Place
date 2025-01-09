import { Product } from './../../../common/enums/Products';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { CustomError } from 'src/app/common/enums/CustomErrors';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss'],
})
export class AddProductsComponent {
  form: FormGroup;
  showSuccessBanner = false;
  uploadedImages: { url: string; altText: string }[] = []; // stores previewed image URLs and alt text

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private logger: NGXLogger
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [100, [Validators.required, Validators.min(100)]],
      stock: [1, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      images: this.fb.array([this.createImageGroup()]),
    });
  }

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }

  get price() {
    return this.form.get('price');
  }

  get stock() {
    return this.form.get('stock');
  }

  get category() {
    return this.form.get('category');
  }

  get images() {
    return this.form.get('images') as FormArray;
  }

  createImageGroup(): FormGroup {
    return this.fb.group({
      url: ['', Validators.required],
      altText: ['Product image'],
    });
  }

  addImage() {
    if (this.images.length > this.uploadedImages.length) {
      this.images.setErrors({ error: CustomError.INVALID_FILE_UPLOAD });
      return;
    }
    this.images.push(this.createImageGroup());
  }

  removeImage(index: number) {
    if (this.images.length === 1) {
      this.images.removeAt(index);
      this.images.push(this.createImageGroup());
    } else if (this.images.length > 0) {
      this.images.removeAt(index);
    }
    this.uploadedImages.splice(index, 1);
  }

  onImageUpload(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // Limit to 5MB
        this.images.setErrors({ error: CustomError.FILE_TOO_LARGE });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const imageBase64 = reader.result as string;

        // Send base64 data to the backend for upload
        this.productService
          .uploadImage(imageBase64)
          .subscribe((response: any) => {
            this.uploadedImages[index] = {
              url: response.url,
              altText: 'Product image',
            };
            this.images.at(index).patchValue({ url: response.url });
          });
      };

      reader.onerror = () => {
        this.logger.error('Error loading image');
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    this.form.markAllAsTouched();
    if (this.uploadedImages.length === 0) {
      this.images.setErrors({ error: CustomError.UPLOAD_AT_LEAST_ONE_IMAGE });
      return;
    }
    if (this.form.invalid) {
      return;
    }
    let product: Product = this.form.value;
    product.sellerId = this.authService.getTokenDetails()?._id;
    this.productService.addProduct(product).subscribe({
      next: (response) => {
        if (response) {
          this.showSuccessBanner = true;
          setTimeout(() => {
            this.showSuccessBanner = false;
            this.router.navigate(['/seller/home']);
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
}
