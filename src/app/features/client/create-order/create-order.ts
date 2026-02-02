import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { SalesOrderService } from '../../../core/services/sales-order.service';
import { ToastService } from '../../../core/services/toast.service';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Product } from '../../../shared/models/product.model';
import { Warehouse } from '../../../shared/models/warehouse.model';

@Component({
  selector: 'app-create-order',
  standalone: false,
  templateUrl: './create-order.html',
  styleUrl: './create-order.css',
})
export class CreateOrder implements OnInit {
  orderForm!: FormGroup;
  loading = false;
  submitting = false;
  // allProducts: Product[] = []; // Not needed if we don't filter
  products: Product[] = [];
  warehouses: Warehouse[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    // private inventoryService: InventoryService, // Removed
    private salesOrderService: SalesOrderService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    } else {
        this.loading = false;
    }
    
    // Subscribe to warehouse changes - Removed filtering
    // this.orderForm.get('warehouseId')?.valueChanges.subscribe(warehouseId => {
    //     if (warehouseId) {
    //         this.filterProductsByWarehouse(warehouseId);
    //     } else {
    //         this.products = [];
    //     }
    // });
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      warehouseId: ['', Validators.required],
      lines: this.fb.array([])
    });
    this.addLine(); // Start with one empty line
  }
  
  // private filterProductsByWarehouse(warehouseId: string): void { ... } // Removed

  private loadData(): void {
    this.loading = true;
    
    let warehousesLoaded = false;
    let productsLoaded = false;
    
    const checkLoading = () => {
        if (warehousesLoaded && productsLoaded) {
            this.loading = false;
            this.cdr.markForCheck();
        }
    };

    this.warehouseService.getAll().subscribe({
      next: (data) => {
          this.warehouses = data;
          warehousesLoaded = true;
          checkLoading();
      },
      error: (err) => {
          console.error('Failed to load warehouses', err);
          warehousesLoaded = true; 
          checkLoading();
      }
    });

    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data; // Show all products
        productsLoaded = true;
        checkLoading();
      },
      error: (err) => {
        console.error('Failed to load products', err);
        productsLoaded = true; 
        checkLoading();
      }
    });
  }

  get lines(): FormArray {
    return this.orderForm.get('lines') as FormArray;
  }

  addLine(): void {
    const lineGroup = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [{value: 0, disabled: true}] // Read-only, driven by product selection
    });

    // Watch for product changes to update unit price
    lineGroup.get('productId')?.valueChanges.subscribe(productId => {
      const product = this.products.find(p => p.id === productId);
      if (product) {
        lineGroup.patchValue({ unitPrice: product.boughtPrice }); // Using boughtPrice as default sell price
      }
    });

    this.lines.push(lineGroup);
  }

  removeLine(index: number): void {
    this.lines.removeAt(index);
  }

  onSubmit(): void {
    if (this.orderForm.invalid || this.lines.length === 0) {
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toastService.error('You must be logged in to create an order');
      return;
    }

    this.submitting = true;
    const formValue = this.orderForm.getRawValue(); // Use getRawValue to include disabled fields if needed, or just standard value

    // Helper to get price for a product ID (in case form value is not trusted or simply to ensure consistency)
    // However, the form 'unitPrice' is what we want to send if we allowed edits.
    // If unitPrice is disabled, it won't be in formValue unless we use getRawValue(). 
    // BUT the backend expects clean data.
    
    const orderData = {
      clientId: user.id,
      warehouseId: formValue.warehouseId,
      lines: formValue.lines.map((line: any) => ({
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.unitPrice, // This comes from the form state
        backorder: false // Default to false as per requirement
      }))
    };

    this.salesOrderService.create(orderData).subscribe({
      next: (res) => {
        this.toastService.success('Order created successfully');
        this.router.navigate(['../my-orders']);
      },
      error: (err) => {
        console.error('Failed to create order', err);
        this.toastService.error('Failed to create order');
        this.submitting = false;
      }
    });
  }

  calculateTotal(): number {
    // Helper to show estimated total on UI
    return this.lines.controls.reduce((sum, control) => {
      const val = control.getRawValue();
      return sum + (val.quantity * (val.unitPrice || 0));
    }, 0);
  }
}
