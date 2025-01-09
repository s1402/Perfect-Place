export enum ProductCategory {
  MEN = 'Men',
  WOMEN = 'Women',
  CHILDREN = 'Children',
  ALL = 'All',
}

export interface Product {
  name?: string;
  description?: string;
  price?: string;
  stock?: number;
  category?: ProductCategory;
  images: [{ url: string; altText: string }];
  sellerId?: string;
  currentIndex?: number;
}

export interface ProductDetails {
  name?: string;
  description?: string;
  price?: string;
  stock?: number;
  category?: ProductCategory;
  images: [{ url: string; altText: string }];
  sellerId?: {
    businessName: string;
    email: string;
  };
  currentIndex?: number;
  quantity?: number;
  _id?: string;
}
