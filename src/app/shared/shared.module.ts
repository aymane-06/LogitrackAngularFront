import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';
import { DataTableComponent } from './components/data-table.component';
import { FormErrorComponent } from './components/form-error.component';
import { LoadingSpinnerComponent } from './components/loading-spinner.component';
import { NotificationComponent } from './components/notification.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    FormErrorComponent,
    NotificationComponent,
    DataTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    FormErrorComponent,
    NotificationComponent,
    DataTableComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
