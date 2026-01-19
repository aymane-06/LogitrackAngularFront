import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTable } from './components/data-table/data-table';
import { Modal } from './components/modal/modal';
import { Navbar } from './components/navbar/navbar';
import { ProductFormModal } from './components/product-form-modal/product-form-modal';
import { Sidebar } from './components/sidebar/sidebar';
import { StatsCard } from './components/stats-card/stats-card';
import { SupplierFormModal } from './components/supplier-form-modal/supplier-form-modal';
import { ToastComponent } from './components/toast/toast';
import { UserFormModal } from './components/user-form-modal/user-form-modal';
import { WarehouseFormModal } from './components/warehouse-form-modal/warehouse-form-modal';

@NgModule({
  declarations: [
    Sidebar,
    Navbar,
    StatsCard,
    ToastComponent,
    DataTable,
    Modal,
    UserFormModal,
    ProductFormModal,
    WarehouseFormModal,
    SupplierFormModal
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    Sidebar,
    Navbar,
    StatsCard,
    ToastComponent,
    DataTable,
    Modal,
    UserFormModal,
    ProductFormModal,
    WarehouseFormModal,
    SupplierFormModal,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
