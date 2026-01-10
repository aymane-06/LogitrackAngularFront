export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED'
}

export interface PurchaseOrderLine {
  id?: number;
  productId: number;
  productSku?: string;
  productName?: string;
  orderedQty: number;
  receivedQty: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  supplierName?: string;
  warehouseId: number;
  warehouseName?: string;
  status: PurchaseOrderStatus;
  orderLines: PurchaseOrderLine[];
  totalAmount: number;
  expectedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
  receivedAt?: string;
}

export interface CreatePurchaseOrderRequest {
  supplierId: number;
  warehouseId: number;
  expectedDeliveryDate: string;
  orderLines: PurchaseOrderLine[];
}

export interface ReceivePurchaseOrderRequest {
  poId: number;
  receiptLines: {
    lineId: number;
    receivedQty: number;
  }[];
}
