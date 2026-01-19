import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Supplier {
  id?: number;
  name: string;
  code: string;
  contact: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  status: string;
}

@Component({
  selector: 'app-supplier-form-modal',
  templateUrl: './supplier-form-modal.html',
  styleUrls: ['./supplier-form-modal.css'],
  standalone: false
})
export class SupplierFormModal implements OnInit {
  @Input() isOpen = false;
  @Input() supplier?: Supplier;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Supplier>();

  supplierForm!: FormGroup;
  isEditMode = false;

  categories = ['Electronics', 'Furniture', 'Logistics', 'Office Supplies', 'Equipment'];
  statuses = ['Active', 'Pending', 'Inactive'];

  constructor(private fb: FormBuilder) {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.pattern(/^SUP-\d{3}$/)]],
      contact: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?1?-?\d{3}-?\d{3}-?\d{4}$/)]],
      category: ['Electronics', Validators.required],
      rating: [5, [Validators.required, Validators.min(0), Validators.max(5)]],
      status: ['Active', Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.supplier) {
      this.isEditMode = true;
      this.supplierForm.patchValue(this.supplier);
    } else {
      this.isEditMode = false;
      this.supplierForm.reset({
        name: '',
        code: '',
        contact: '',
        email: '',
        phone: '',
        category: 'Electronics',
        rating: 5,
        status: 'Active'
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      const formValue = this.supplierForm.value;
      const supplierData: Supplier = {
        ...formValue,
        ...(this.isEditMode && this.supplier?.id ? { id: this.supplier.id } : {})
      };
      this.save.emit(supplierData);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.supplierForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Invalid email format';
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'code') {
        return 'Code must be in format: SUP-000 (e.g., SUP-001)';
      }
      if (fieldName === 'phone') {
        return 'Phone must be in format: +1-555-0100 or 555-555-5555';
      }
    }
    if (field?.hasError('min')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('max')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at most ${field.errors?.['max'].max}`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
