import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Warehouse } from '../../models/warehouse.model';

interface Product {
  id?: number;
  name: string;
  sku?: string;
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
  @Input() product?: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  productForm!: FormGroup;
  isEditMode = false;

  categories = ['Electronics', 'Furniture', 'Lighting', 'Office Supplies', 'Equipment'];
  warehouses: Warehouse[] = [];
  statuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],

      category: ['Electronics', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      warehouse: ['', Validators.required],
      status: ['In Stock', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.warehouseService.getAll().subscribe({
      next: (data) => {
        this.warehouses = data;
        // Set default if empty
        if (this.warehouses.length > 0 && !this.product) {
            this.productForm.patchValue({ warehouse: this.warehouses[0].name });
        }
      },
      error: (err) => console.error('Failed to load warehouses', err)
    });
  }

  ngOnChanges(): void {
    if (this.product) {
      this.isEditMode = true;
      this.productForm.patchValue(this.product);
    } else {
      this.isEditMode = false;
      this.productForm.reset({
        name: '',

        category: 'Electronics',
        price: 0,
        stock: 0,
        warehouse: '',
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
        ...(this.isEditMode && this.product ? { 
            id: this.product.id,
            sku: this.product.sku 
        } : {})
      };
      this.save.emit(productData);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
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
