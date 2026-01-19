import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Product {
  id?: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  warehouse: string;
  status: string;
}

@Component({
  selector: 'app-product-form-modal',
  templateUrl: './product-form-modal.html',
  styleUrls: ['./product-form-modal.css'],
  standalone: false
})
export class ProductFormModal implements OnInit {
  @Input() isOpen = false;
  @Input() product?: Product;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Product>();

  productForm!: FormGroup;
  isEditMode = false;

  categories = ['Electronics', 'Furniture', 'Lighting', 'Office Supplies', 'Equipment'];
  warehouses = ['Main Warehouse', 'North Warehouse', 'South Warehouse', 'West Warehouse'];
  statuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-\d{3}$/)]],
      category: ['Electronics', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      warehouse: ['Main Warehouse', Validators.required],
      status: ['In Stock', Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.product) {
      this.isEditMode = true;
      this.productForm.patchValue(this.product);
    } else {
      this.isEditMode = false;
      this.productForm.reset({
        name: '',
        sku: '',
        category: 'Electronics',
        price: 0,
        stock: 0,
        warehouse: 'Main Warehouse',
        status: 'In Stock'
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const productData: Product = {
        ...formValue,
        ...(this.isEditMode && this.product?.id ? { id: this.product.id } : {})
      };
      this.save.emit(productData);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('pattern')) {
      return 'SKU must be in format: XXX-000 (e.g., LAP-001)';
    }
    if (field?.hasError('min')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 0`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
