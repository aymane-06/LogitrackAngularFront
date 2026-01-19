export interface Supplier {
  id: string;
  name: string;
  contactInfo: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierDTO {
  name: string;
  contactInfo: string;
}
