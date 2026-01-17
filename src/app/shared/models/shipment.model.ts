import { Carrier } from './carrier.model';

export enum ShipmentStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
}

export interface Shipment {
  id: string;
  salesOrderId: string;
  carrier: Carrier;
  trackingNumber: string;
  status: ShipmentStatus;
  shippedAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  shippingCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentDTO {
  salesOrderId: string;
  carrierId: string;
  trackingNumber: string;
  estimatedDelivery: string;
  shippingCost: number;
}
