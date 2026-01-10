export enum MovementType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
  ADJUSTMENT = 'ADJUSTMENT'
}

export interface Movement {
  id: number;
  type: MovementType;
  productId: number;
  productSku?: string;
  productName?: string;
  warehouseId: number;
  warehouseName?: string;
  quantity: number;
  reason: string;
  referenceNumber?: string;
  createdBy: number;
  createdByName?: string;
  createdAt: string;
}

export interface CreateMovementRequest {
  type: MovementType;
  productId: number;
  warehouseId: number;
  quantity: number;
  reason: string;
  referenceNumber?: string;
}
