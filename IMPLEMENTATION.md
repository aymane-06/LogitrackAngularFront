# LogiTrack Angular Frontend - Implementation Documentation

## Overview

This document provides comprehensive documentation for the LogiTrack Angular frontend implementation, which fully integrates with the backend API from the `aymane-06/logistiqueTrack` repository (security branch).

## Architecture

### Technology Stack
- **Angular 21**: Latest Angular framework
- **TypeScript 5.9**: Strict mode enabled
- **TailwindCSS 4**: Utility-first CSS framework
- **RxJS 7.8**: Reactive programming with observables
- **Angular SSR**: Server-side rendering support

## Project Structure

```
src/
├── app/
│   ├── core/                      # Core module with singleton services
│   │   ├── guards/
│   │   │   ├── auth.guard.ts      # Authentication guard
│   │   │   └── role.guard.ts      # Role-based authorization guard
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts    # JWT token injection
│   │   │   └── error.interceptor.ts   # Global error handling
│   │   └── services/
│   │       ├── auth.service.ts        # Authentication service
│   │       ├── token.service.ts       # Token management
│   │       ├── product.service.ts     # Product CRUD operations
│   │       ├── warehouse.service.ts   # Warehouse CRUD operations
│   │       ├── carrier.service.ts     # Carrier CRUD operations
│   │       ├── supplier.service.ts    # Supplier CRUD operations
│   │       ├── purchase-order.service.ts  # Purchase order workflows
│   │       ├── sales-order.service.ts     # Sales order workflows
│   │       ├── inventory.service.ts   # Inventory management
│   │       └── user.service.ts        # User management
│   │
│   ├── shared/                    # Shared module with reusable components
│   │   ├── components/
│   │   │   ├── data-table.component.ts     # Generic data table
│   │   │   ├── loading-spinner.component.ts # Loading indicator
│   │   │   ├── confirm-dialog.component.ts  # Confirmation dialog
│   │   │   ├── notification.component.ts    # Toast notifications
│   │   │   └── form-error.component.ts      # Form validation errors
│   │   ├── models/
│   │   │   ├── product.model.ts
│   │   │   ├── warehouse.model.ts
│   │   │   ├── carrier.model.ts
│   │   │   ├── supplier.model.ts
│   │   │   ├── purchase-order.model.ts
│   │   │   ├── order.model.ts (sales orders)
│   │   │   ├── inventory.model.ts
│   │   │   ├── shipment.model.ts
│   │   │   └── user.model.ts
│   │   └── shared.module.ts
│   │
│   ├── features/                  # Feature modules
│   │   ├── auth/                  # Authentication module
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── auth-module.ts
│   │   │
│   │   ├── admin/                 # Admin module (lazy-loaded)
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── warehouses/
│   │   │   ├── carriers/
│   │   │   ├── suppliers/
│   │   │   ├── users/
│   │   │   ├── admin-routing-module.ts
│   │   │   └── admin-module.ts
│   │   │
│   │   ├── warehouse-manager/     # Warehouse Manager module (lazy-loaded)
│   │   │   ├── dashboard/
│   │   │   ├── purchase-orders/
│   │   │   ├── sales-orders/
│   │   │   ├── inventory/
│   │   │   ├── warehouse-manager-routing-module.ts
│   │   │   └── warehouse-manager-module.ts
│   │   │
│   │   ├── client/                # Client module (lazy-loaded)
│   │   │   ├── dashboard/
│   │   │   ├── create-order/
│   │   │   ├── my-orders/
│   │   │   ├── client-routing-module.ts
│   │   │   └── client-module.ts
│   │   │
│   │   ├── home/
│   │   └── unauthorized/
│   │
│   ├── app-routing-module.ts      # Main app routing
│   └── app-module.ts              # Main app module
│
└── environments/
    ├── environment.ts             # Development environment
    └── environment.prod.ts        # Production environment
```

## Implementation Details

### 1. Environment Configuration

**Development (`environment.ts`):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

**Production (`environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.logitrack.com/api'
};
```

### 2. Data Models

All TypeScript interfaces match backend DTOs exactly:

- **UUID-based IDs**: All entity IDs use `string` type (UUID format)
- **Enums**: Status enums match backend exactly (e.g., `OrderStatus`, `PurchaseOrderStatus`, `CarrierStatus`)
- **DTOs**: Separate DTO interfaces for create/update operations
- **Nested Objects**: Models include nested relationships (e.g., `SalesOrder` includes `Client`, `Warehouse`, `Shipment`)

### 3. Services

All services extend the base HTTP service pattern:

#### Service Methods Pattern:
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> { }
  getById(id: string): Observable<Product> { }
  create(product: ProductDTO): Observable<Product> { }
  update(id: string, product: ProductDTO): Observable<Product> { }
  delete(id: string): Observable<void> { }
}
```

#### Workflow Services:
- **PurchaseOrderService**: `approve()`, `receive()` methods
- **SalesOrderService**: `reserve()`, `ship()`, `deliver()` methods

### 4. Authentication Flow

1. User logs in via `/auth/login`
2. Backend returns JWT access token and refresh token
3. Tokens stored via `TokenService`
4. `AuthInterceptor` adds Bearer token to all API requests
5. On 401 responses, `AuthInterceptor` automatically refreshes token
6. `AuthGuard` protects routes requiring authentication
7. `RoleGuard` protects routes by user role

### 5. Routing Structure

```typescript
const routes: Routes = [
  { path: '', component: Home },
  { 
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] },
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: 'warehouse-manager',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.WAREHOUSE_MANAGER] },
    loadChildren: () => import('./features/warehouse-manager/warehouse-manager-module').then(m => m.WarehouseManagerModule)
  },
  {
    path: 'client',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.CLIENT] },
    loadChildren: () => import('./features/client/client-module').then(m => m.ClientModule)
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '' }
];
```

### 6. Shared Components

#### DataTableComponent
Generic, reusable data table with:
- Sorting (client-side)
- Filtering/search
- Pagination
- Customizable columns
- Row actions

**Usage:**
```typescript
<app-data-table
  [columns]="columns"
  [data]="products"
  [actions]="actions"
  [loading]="loading"
  [searchable]="true"
  [paginate]="true"
  [pageSize]="10">
</app-data-table>
```

#### Other Components
- **LoadingSpinnerComponent**: Configurable loading indicator
- **ConfirmDialogComponent**: Modal confirmation dialog
- **NotificationComponent**: Toast notifications with auto-dismiss
- **FormErrorComponent**: Form validation error display

## API Integration

### Backend Endpoints

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (ADMIN)
- `PUT /api/products/{id}` - Update product (ADMIN)
- `DELETE /api/products/{id}` - Delete product (ADMIN)

#### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `GET /api/warehouses/{id}` - Get warehouse by ID
- `POST /api/warehouses` - Create warehouse (ADMIN)
- `PUT /api/warehouses/{id}` - Update warehouse (ADMIN)
- `DELETE /api/warehouses/{id}` - Delete warehouse (ADMIN)

#### Purchase Orders
- `GET /api/purchase-orders` - Get all purchase orders (ADMIN, WAREHOUSE_MANAGER)
- `GET /api/purchase-orders/{id}` - Get purchase order by ID
- `POST /api/purchase-orders` - Create purchase order (ADMIN, WAREHOUSE_MANAGER)
- `PUT /api/purchase-orders/{id}/approve` - Approve purchase order
- `PUT /api/purchase-orders/{id}/receive` - Receive purchase order
- `DELETE /api/purchase-orders/{id}` - Delete purchase order (ADMIN)

#### Sales Orders
- `GET /api/sales-orders/all` - Get all sales orders (ADMIN, WAREHOUSE_MANAGER)
- `GET /api/sales-orders/{id}` - Get sales order by ID
- `POST /api/sales-orders` - Create sales order (ADMIN, CLIENT)
- `PUT /api/sales-orders/{id}/reserve` - Reserve inventory (ADMIN, WAREHOUSE_MANAGER)
- `PUT /api/sales-orders/{id}/ship` - Ship order (ADMIN, WAREHOUSE_MANAGER)
- `PUT /api/sales-orders/{id}/deliver` - Mark as delivered (ADMIN, WAREHOUSE_MANAGER)
- `DELETE /api/sales-orders/{id}` - Delete order (ADMIN)

## User Roles & Permissions

### ADMIN
- Full access to all modules
- Can manage users, products, warehouses, carriers, suppliers
- Can create/manage both purchase orders and sales orders
- Access to all reports and analytics

### WAREHOUSE_MANAGER
- Access to warehouse operations
- Can manage purchase orders (create, approve, receive)
- Can process sales orders (reserve, ship, deliver)
- Can manage inventory
- Access to warehouse-specific reports

### CLIENT
- Limited access to order functionality
- Can create sales orders
- Can view own orders
- Can track order status
- No access to inventory or management features

## Security Features

1. **JWT Authentication**: Bearer token-based authentication
2. **Token Refresh**: Automatic token refresh on 401 responses
3. **Route Guards**: Authentication and role-based authorization
4. **HTTP Interceptors**: Automatic token injection and error handling
5. **TypeScript Strict Mode**: Enhanced type safety
6. **Input Validation**: Form validation with reactive forms
7. **XSS Protection**: Angular's built-in sanitization
8. **CSRF Protection**: Configured via backend

## Development Guidelines

### Building the Application
```bash
npm install
npm run build
```

### Development Server
```bash
npm start
# Navigate to http://localhost:4200
```

### Testing
```bash
npm test
```

### Code Style
- Follow Angular Style Guide
- Use TypeScript strict mode
- Prefer reactive patterns (Observables)
- Use reactive forms for all forms
- Implement proper error handling
- Add loading states for async operations

## Best Practices Implemented

1. **Lazy Loading**: All feature modules are lazy-loaded for better performance
2. **Separation of Concerns**: Clear separation between core, shared, and feature modules
3. **Immutability**: Components don't mutate input data
4. **Type Safety**: Strict TypeScript typing throughout
5. **Reactive Programming**: RxJS operators for data streams
6. **Component Reusability**: Shared component library
7. **Environment Configuration**: Separate configs for dev/prod
8. **Error Handling**: Global error interceptor with user-friendly messages
9. **Loading States**: Consistent loading indicators
10. **Responsive Design**: TailwindCSS utilities for mobile-friendly UI

## Next Steps for Component Implementation

While the infrastructure is complete, individual component logic needs to be implemented:

1. **Dashboard Components**: Add statistics, charts, and summary data
2. **Management Components**: Implement CRUD operations using the services
3. **Form Components**: Add reactive forms with validation
4. **Order Processing**: Implement workflow UIs for order status transitions
5. **Inventory Management**: Add inventory tracking and alerts
6. **Reports**: Implement data visualization and export features

## Conclusion

The LogiTrack Angular frontend now has a complete infrastructure with:
- ✅ All backend-matching data models
- ✅ Full CRUD services for all entities
- ✅ Authentication and authorization
- ✅ Role-based routing
- ✅ Reusable shared components
- ✅ Three feature modules with lazy loading
- ✅ Environment configuration
- ✅ Type-safe, secure implementation
- ✅ Zero security vulnerabilities
- ✅ Successful build with no errors

The foundation is solid and ready for component-level implementation.
