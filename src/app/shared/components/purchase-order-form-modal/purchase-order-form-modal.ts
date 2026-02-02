import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Product } from '../../models/product.model';
import { PurchaseOrder, PurchaseOrderDTO } from '../../models/purchase-order.model';
import { Supplier } from '../../models/supplier.model';
import { Warehouse } from '../../models/warehouse.model';

@Component({
  selector: 'app-purchase-order-form-modal',
  templateUrl: './purchase-order-form-modal.html',
  styleUrls: ['./purchase-order-form-modal.css'],
  standalone: false
})
export class PurchaseOrderFormModal implements OnInit {
  @Input() isOpen = false;
  @Input() order: PurchaseOrder | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<PurchaseOrderDTO>();

  form: FormGroup;
  suppliers: Supplier[] = [];
  warehouses: Warehouse[] = [];
  products: Product[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private warehouseService: WarehouseService,
    private productService: ProductService
  ) {
    this.form = this.fb.group({
      supplierId: ['', Validators.required],
      warehouseId: ['', Validators.required],
      expectedDelivery: ['', Validators.required],
      lines: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadDependencies();
  }

  // Reload data when modal opens or order changes
  ngOnChanges(): void {
    if (this.isOpen) {
      this.initForm();
    }
  }

  get lines(): FormArray {
    return this.form.get('lines') as FormArray;
  }

  loadDependencies(): void {
    this.loading = true;
    // Parallel loading of dependencies
    // In a real app we might use forkJoin, but separate subscribes are fine for now
    this.supplierService.getAll().subscribe(data => this.suppliers = data);
    this.warehouseService.getAll().subscribe(data => this.warehouses = data);
    this.productService.getAll().subscribe(data => {
      this.products = data;
      this.loading = false;
    });
  }

  initForm(): void {
    this.lines.clear();
    if (this.order) {
      this.form.patchValue({
        supplierId: this.order.supplier.id,
        warehouseId: this.order.warehouse.id,
        expectedDelivery: this.order.expectedDelivery
      });
      
      this.order.lines.forEach(line => {
        this.lines.push(this.createLineFormGroup(line));
      });
    } else {
      this.form.reset();
      this.addLine(); // Start with one empty line
    }
  }

  createLineFormGroup(line?: any): FormGroup {
    return this.fb.group({
      productId: [line ? line.product.id : '', Validators.required],
      quantity: [line ? line.quantity : 1, [Validators.required, Validators.min(1)]],
      unitCost: [line ? line.unitCost : 0, [Validators.required, Validators.min(0)]]
    });
  }

  addLine(): void {
    this.lines.push(this.createLineFormGroup());
  }

  removeLine(index: number): void {
    this.lines.removeAt(index);
  }

  onSave(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      // Backend expects LocalDateTime (ISO-8601 with time), but input[type="date"] gives YYYY-MM-DD
      // We append T00:00:00 to satisfy the backend deserializer
      const payload = {
        ...formValue,
        expectedDelivery: `${formValue.expectedDelivery}T00:00:00`
      };
      this.save.emit(payload);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onClose(): void {
    this.close.emit();
    this.form.reset();
  }
}
