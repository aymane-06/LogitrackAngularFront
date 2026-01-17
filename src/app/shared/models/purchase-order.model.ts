import { Product } from './product.model';
import { Supplier } from './supplier.model';
import { Warehouse } from './warehouse.model';

export enum PurchaseOrderStatus {
  CREATED = 'CREATED',
  APPROVED = 'APPROVED',
  RECEIVED = 'RECEIVED',
  CANCELED = 'CANCELED'
}

export interface PurchaseOrderLine {
  id: string;
  product: Product;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  supplier: Supplier;
  warehouse: Warehouse;
  status: PurchaseOrderStatus;
  expectedDelivery: string;
  lines: PurchaseOrderLine[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderDTO {
  supplierId: string;
  warehouseId: string;
  expectedDelivery: string;
  lines: {
    productId: string;
    quantity: number;
    unitCost: number;
  }[];
}
