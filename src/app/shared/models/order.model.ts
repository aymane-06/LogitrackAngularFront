import { Product } from './product.model';
import { Shipment } from './shipment.model';
import { Client } from './user.model';
import { Warehouse } from './warehouse.model';

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
  clientId: string;
  warehouseId: string;
  lines: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}
