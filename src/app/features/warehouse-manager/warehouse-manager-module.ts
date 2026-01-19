import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { WarehouseManagerRoutingModule } from './warehouse-manager-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { Inventory } from './inventory/inventory';
import { SalesOrders } from './sales-orders/sales-orders';
import { PurchaseOrders } from './purchase-orders/purchase-orders';

@NgModule({
  declarations: [
    Dashboard,
    Inventory,
    SalesOrders,
    PurchaseOrders
  ],
  imports: [
    CommonModule,
    SharedModule,
    WarehouseManagerRoutingModule
  ]
})
export class WarehouseManagerModule { }
