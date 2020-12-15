export interface OrdersAddress {
  coordinates: string;
  formatted: string;
  userId?: number;
}

export interface OrdersServing {
  productId: number;
  count: number;
}
