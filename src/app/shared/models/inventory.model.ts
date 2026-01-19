import { Product } from './product.model';
import { Warehouse } from './warehouse.model';

export interface Inventory {
  id: string;
  product: Product;
  warehouse: Warehouse;
  quantity: number;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryDTO {
  productId: string;
  warehouseId: string;
  quantity: number;
  reorderLevel: number;
}
