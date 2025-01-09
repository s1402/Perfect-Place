export interface TokenDetails {
  email: string;
  iat: string | number;
  _id: string;
  name: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postcalCode: string;
  };
  businessAddress?: {
    street: string;
    city: string;
    state: string;
    postcalCode: string;
  };
  isSeller?: boolean;
}
