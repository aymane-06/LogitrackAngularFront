import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../models/user.model';

interface Warehouse {
  id?: number;
  name: string;
  location: string;
  warehouseManagerId: string;
  active: boolean;
}

@Component({
  selector: 'app-warehouse-form-modal',
  templateUrl: './warehouse-form-modal.html',
  styleUrls: ['./warehouse-form-modal.css'],
  standalone: false
})
export class WarehouseFormModal implements OnInit {
  @Input() isOpen = false;
  @Input() warehouse?: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  warehouseForm!: FormGroup;
  isEditMode = false;

  managers: User[] = [];
  statuses = ['Active', 'Inactive', 'Nearly Full', 'Maintenance'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.warehouseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required]],
      warehouseManagerId: ['', [Validators.required]],
      active: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadManagers();
  }

  loadManagers(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.managers = users.filter(user => user.role === UserRole.WAREHOUSE_MANAGER);
        // If creating new and managers exist, select first
        if (this.managers.length > 0 && !this.warehouse) {
          this.warehouseForm.patchValue({ warehouseManagerId: this.managers[0].id });
        }
      },
      error: (err) => console.error('Failed to load managers', err)
    });
  }

  ngOnChanges(): void {
    if (this.warehouse) {
      this.isEditMode = true;
      this.warehouseForm.patchValue({
        ...this.warehouse,
        warehouseManagerId: this.warehouse.warehouseManager?.id
      });
    } else {
      this.isEditMode = false;
      this.warehouseForm.reset({
        name: '',
        location: '',
        warehouseManagerId: '',
        active: true
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.warehouseForm.valid) {
      const formValue = this.warehouseForm.value;
      const warehouseData: Warehouse = {
        ...formValue,
        ...(this.isEditMode && this.warehouse?.id ? { id: this.warehouse.id } : {})
      };
      this.save.emit(warehouseData);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.warehouseForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
