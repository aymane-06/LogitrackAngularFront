export enum OrderStatus {
  CREATED = 'CREATED',
  RESERVED = 'RESERVED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderLine {
  id?: number;
  productId: number;
  productSku?: string;
  productName?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface SalesOrder {
  id: number;
  orderNumber: string;
  clientId: number;
  clientName?: string;
  status: OrderStatus;
  warehouseId: number;
  warehouseName?: string;
  orderLines: OrderLine[];
  totalAmount: number;
  reservationTTL?: string; // ISO timestamp for reservation expiry
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface CreateOrderRequest {
  warehouseId: number;
  orderLines: OrderLine[];
}

export interface OrderSummary {
  totalOrders: number;
  createdCount: number;
  reservedCount: number;
  shippedCount: number;
  deliveredCount: number;
  cancelledCount: number;
}
