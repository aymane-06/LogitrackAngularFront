export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  supplierId: number;
  supplierName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreate {
  sku: string;
  name: string;
  description: string;
  price: number;
  supplierId: number;
}
