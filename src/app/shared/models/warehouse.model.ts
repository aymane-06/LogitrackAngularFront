import { Inventory } from './inventory.model';
import { User } from './user.model';

export interface WarehouseManager extends User {
  // Additional warehouse manager specific fields if needed
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  location: string;
  active: boolean;
  warehouseManager?: WarehouseManager;
  inventories?: Inventory[];
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseDTO {
  name: string;
  location: string;
  warehouseManagerId: string;
  active: boolean;
}
