export enum CarrierStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface Carrier {
  id: string;
  code: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  baseShippingRate: number;
  maxDailyCapacity: number;
  currentDailyShipments: number;
  cutOffTime: string;
  status: CarrierStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CarrierDTO {
  name: string;
  contactEmail: string;
  contactPhone: string;
  baseShippingRate: number;
  maxDailyCapacity: number;
  cutOffTime: string;
  status: CarrierStatus;
}
