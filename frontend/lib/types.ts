export interface Order {
  id: number;
  product: string;
  quantity: number;
  customerName: string;
}

export type OrderPayload = Omit<Order, 'id'>;
