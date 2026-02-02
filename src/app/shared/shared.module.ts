import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PurchaseOrders } from '../features/warehouse-manager/purchase-orders/purchase-orders';
import { DashboardLayout } from './components/dashboard-layout/dashboard-layout';
import { DataTableComponent } from './components/data-table.component';
import { LoadingSpinnerComponent } from './components/loading-spinner.component';
import { Modal } from './components/modal/modal';
import { Navbar } from './components/navbar/navbar';
import { ProductFormModal } from './components/product-form-modal/product-form-modal';
import { PurchaseOrderFormModal } from './components/purchase-order-form-modal/purchase-order-form-modal';
import { Sidebar } from './components/sidebar/sidebar';
import { StatsCard } from './components/stats-card/stats-card';
import { SupplierFormModal } from './components/supplier-form-modal/supplier-form-modal';
import { ToastComponent } from './components/toast/toast';
import { UserFormModal } from './components/user-form-modal/user-form-modal';
import { WarehouseFormModal } from './components/warehouse-form-modal/warehouse-form-modal';

@NgModule({
  declarations: [
    DashboardLayout,
    Sidebar,
    Navbar,
    StatsCard,
    ToastComponent,
    DataTableComponent,
    LoadingSpinnerComponent,
    Modal,
    UserFormModal,
    ProductFormModal,
    WarehouseFormModal,
    SupplierFormModal,
    PurchaseOrderFormModal,
    PurchaseOrders
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    DashboardLayout,
    Sidebar,
    Navbar,
    StatsCard,
    ToastComponent,
    DataTableComponent,
    LoadingSpinnerComponent,
    Modal,
    UserFormModal,
    ProductFormModal,
    WarehouseFormModal,
    SupplierFormModal,
    PurchaseOrderFormModal,
    PurchaseOrders,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
