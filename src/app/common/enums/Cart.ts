export interface CartDetails {
  buyerId?: string;
  productId?: string;
  quantity?: number;
}

export interface CartItem {
  productId: {
    _id?: string;
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    images?: Array<{ url: string; altText?: string }>;
    sellerId?: {
      _id: string;
      name: string;
      email: string;
      businessName: string;
      phone: string;
      businessAddress: string;
    };
  };
  quantity?: number;
}
