import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Dashboard } from './dashboard/dashboard';
import { Inventory } from './inventory/inventory';
import { SalesOrders } from './sales-orders/sales-orders';
import { WarehouseManagerRoutingModule } from './warehouse-manager-routing-module';

@NgModule({
  declarations: [
    Dashboard,
    Inventory,
    SalesOrders
  ],
  imports: [
    CommonModule,
    SharedModule,
    WarehouseManagerRoutingModule
  ]
})
export class WarehouseManagerModule { }
