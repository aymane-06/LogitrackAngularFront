import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PurchaseOrder, PurchaseOrderDTO } from '../../shared/models/purchase-order.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private readonly API_URL = `${environment.apiUrl}/purchase-orders`;

  constructor(private http: HttpClient) {}

  /**
   * Get all purchase orders (ADMIN, WAREHOUSE_MANAGER)
   */
  getAll(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.API_URL);
  }

  /**
   * Get purchase order by ID
   */
  getById(id: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.API_URL}/${id}`);
  }

  /**
   * Create new purchase order (ADMIN, WAREHOUSE_MANAGER)
   */
  create(purchaseOrder: PurchaseOrderDTO): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(this.API_URL, purchaseOrder);
  }

  /**
   * Approve purchase order (ADMIN, WAREHOUSE_MANAGER)
   */
  approve(id: string): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.API_URL}/${id}/approve`, {});
  }

  /**
   * Receive purchase order (ADMIN, WAREHOUSE_MANAGER)
   */
  receive(id: string): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.API_URL}/${id}/receive`, {});
  }

  /**
   * Delete purchase order (ADMIN)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
