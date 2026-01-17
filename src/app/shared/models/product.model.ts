export interface Product {
  id: string;
  name: string;
  category: string;
  boughtPrice: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDTO {
  name: string;
  category: string;
  boughtPrice: number;
  active: boolean;
}
