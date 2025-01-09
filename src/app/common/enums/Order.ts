export interface OrderDetails {
  buyerId?: string;
  products?: {
    productId?: string;
    quantity?: number;
  }[];
}

export interface Orders {
  _id: string;
  status: string;
  createdAt: Date;
  products: {
    productId: {
      _id?: string;
      name?: string;
      description?: string;
      price?: number;
      category?: string;
      images?: Array<{ url: string; altText?: string }>;
    };
    quantity: number;
  }[];
  totalPrice: number;
}
