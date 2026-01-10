export interface Supplier {
  id: number;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierCreate {
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}
