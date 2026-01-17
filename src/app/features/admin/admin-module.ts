import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { Products } from './products/products';
import { Carriers } from './carriers/carriers';
import { Warehouses } from './warehouses/warehouses';
import { Suppliers } from './suppliers/suppliers';
import { Users } from './users/users';

@NgModule({
  declarations: [
    Dashboard,
    Products,
    Carriers,
    Warehouses,
    Suppliers,
    Users
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
