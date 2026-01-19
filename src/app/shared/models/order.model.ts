import { Client } from './user.model';
import { Product } from './product.model';
import { Warehouse } from './warehouse.model';
import { Shipment } from './shipment.model';

export enum OrderStatus {
  CREATED = 'CREATED',
  RESERVED = 'RESERVED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export interface SalesOrderLine {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface SalesOrder {
  id: string;
  client: Client;
  warehouse: Warehouse;
  status: OrderStatus;
  createdAt: string;
  reservedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  lines: SalesOrderLine[];
  shipment?: Shipment;
  updatedAt: string;
}

export interface SalesOrderDTO {
  warehouseId: string;
  lines: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}
