import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTableComponent } from './components/data-table.component';
import { LoadingSpinnerComponent } from './components/loading-spinner.component';
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
    DataTableComponent,
    LoadingSpinnerComponent,
    Modal,
    UserFormModal,
    ProductFormModal,
    WarehouseFormModal,
    SupplierFormModal
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
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
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
