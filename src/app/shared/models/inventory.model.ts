export interface Inventory {
  id: number;
  productId: number;
  productSku: string;
  productName: string;
  warehouseId: number;
  warehouseCode: string;
  warehouseName: string;
  qtyOnHand: number;
  qtyReserved: number;
  qtyAvailable: number; // qtyOnHand - qtyReserved
  lastUpdated: string;
}

export interface InventoryAvailability {
  productId: number;
  warehouseId: number;
  available: boolean;
  qtyAvailable: number;
}
