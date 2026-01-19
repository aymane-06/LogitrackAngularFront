import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing-module';
import { AdminDashboard } from './dashboard/admin-dashboard';
import { Products } from './products/products';
import { Suppliers } from './suppliers/suppliers';
import { Users } from './users/users';
import { Warehouses } from './warehouses/warehouses';

@NgModule({
  declarations: [
    AdminDashboard,
    Users,
    Products,
    Warehouses,
    Suppliers
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
