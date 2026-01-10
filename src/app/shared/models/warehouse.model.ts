export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  managerId?: number;
  managerName?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseCreate {
  code: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  managerId?: number;
}
