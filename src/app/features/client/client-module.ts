import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ClientRoutingModule } from './client-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { CreateOrder } from './create-order/create-order';
import { MyOrders } from './my-orders/my-orders';

@NgModule({
  declarations: [
    Dashboard,
    CreateOrder,
    MyOrders
  ],
  imports: [
    CommonModule,
    SharedModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
