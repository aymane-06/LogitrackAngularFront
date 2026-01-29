import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Supplier {
  id?: number;
  name: string;
  contactInfo: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-supplier-form-modal',
  templateUrl: './supplier-form-modal.html',
  styleUrls: ['./supplier-form-modal.css'],
  standalone: false
})
export class SupplierFormModal implements OnInit {
  @Input() isOpen = false;
  @Input() supplier?: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  supplierForm!: FormGroup;
  isEditMode = false;

  categories = ['Electronics', 'Furniture', 'Logistics', 'Office Supplies', 'Equipment'];
  statuses = ['Active', 'Pending', 'Inactive'];

  constructor(private fb: FormBuilder) {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contactInfo: ['', [Validators.maxLength(500)]]
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
        contactInfo: ''
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
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field?.hasError('maxlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at most ${field.errors?.['maxlength'].requiredLength} characters`;
    }
    return '';
  }
}
