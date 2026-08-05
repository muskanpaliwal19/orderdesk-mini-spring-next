export type OrderStatus = 'NEW' | 'PAID' | 'SHIPPED' | 'CANCELLED';

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  itemDescription: string;
  quantity: number;
  unitPriceCents: number;
  status: OrderStatus;
  notes: string | null;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export type OrderPayload = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
