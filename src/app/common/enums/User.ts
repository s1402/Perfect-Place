export interface User {
  email?: string;
  password?: string;
  name?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postcalCode: string;
  };
  businessName?: string;
  businessAddress?: {
    street: string;
    city: string;
    state: string;
    postcalCode: string;
  };
  phone?: string;
  isSeller?: boolean;
}

export interface UserDetails {
  email?: string;
  password?: string;
  name?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postcalCode: string;
  };
  businessName?: string;
  businessAddress?: {
    street: string;
    city: string;
    state: string;
    postcalCode: string;
  };
  phone?: string;
  otp?: string;
  isSeller?: boolean;
}

export enum UserTypes {
  BUYER = 'Buyer',
  SELLER = 'Seller',
}
