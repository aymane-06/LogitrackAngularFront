import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { PurchaseOrders } from './purchase-orders/purchase-orders';
import { SalesOrders } from './sales-orders/sales-orders';
import { Inventory } from './inventory/inventory';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'purchase-orders', component: PurchaseOrders },
  { path: 'sales-orders', component: SalesOrders },
  { path: 'inventory', component: Inventory }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseManagerRoutingModule { }
