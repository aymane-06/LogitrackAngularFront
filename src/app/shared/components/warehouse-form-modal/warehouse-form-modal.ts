import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Warehouse {
  id?: number;
  name: string;
  code: string;
  location: string;
  capacity: number;
  currentStock: number;
  manager: string;
  status: string;
}

@Component({
  selector: 'app-warehouse-form-modal',
  templateUrl: './warehouse-form-modal.html',
  styleUrls: ['./warehouse-form-modal.css'],
  standalone: false
})
export class WarehouseFormModal implements OnInit {
  @Input() isOpen = false;
  @Input() warehouse?: Warehouse;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Warehouse>();

  warehouseForm!: FormGroup;
  isEditMode = false;

  statuses = ['Active', 'Inactive', 'Nearly Full', 'Maintenance'];

  constructor(private fb: FormBuilder) {
    this.warehouseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.pattern(/^WH-\d{3}$/)]],
      location: ['', [Validators.required]],
      capacity: [0, [Validators.required, Validators.min(1)]],
      currentStock: [0, [Validators.required, Validators.min(0)]],
      manager: ['', [Validators.required]],
      status: ['Active', Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.warehouse) {
      this.isEditMode = true;
      this.warehouseForm.patchValue(this.warehouse);
    } else {
      this.isEditMode = false;
      this.warehouseForm.reset({
        name: '',
        code: '',
        location: '',
        capacity: 0,
        currentStock: 0,
        manager: '',
        status: 'Active'
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
    if (field?.hasError('pattern')) {
      return 'Code must be in format: WH-000 (e.g., WH-001)';
    }
    if (field?.hasError('min')) {
      const minValue = field.errors?.['min'].min;
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${minValue}`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
