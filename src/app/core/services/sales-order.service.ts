import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SalesOrder, SalesOrderDTO } from '../../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private readonly API_URL = `${environment.apiUrl}/sales-orders`;

  constructor(private http: HttpClient) {}

  /**
   * Get all sales orders (ADMIN, WAREHOUSE_MANAGER)
   */
  getAll(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.API_URL}/all`);
  }

  /**
   * Get sales order by ID
   */
  getById(id: string): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.API_URL}/${id}`);
  }

  /**
   * Create new sales order (ADMIN, CLIENT)
   */
  /**
   * Create new sales order (ADMIN, CLIENT)
   */
  create(salesOrder: SalesOrderDTO): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(`${this.API_URL}/create`, salesOrder);
  }

  /**
   * Reserve sales order inventory (ADMIN, WAREHOUSE_MANAGER)
   */
  reserve(id: string): Observable<SalesOrder> {
    return this.http.put<SalesOrder>(`${this.API_URL}/${id}/reserve`, {});
  }

  /**
   * Ship sales order (ADMIN, WAREHOUSE_MANAGER)
   */
  ship(id: string, carrierId: string): Observable<SalesOrder> {
    return this.http.put<SalesOrder>(`${this.API_URL}/${id}/ship`, { carrierId });
  }

  /**
   * Mark sales order as delivered (ADMIN, WAREHOUSE_MANAGER)
   */
  deliver(id: string): Observable<SalesOrder> {
    return this.http.put<SalesOrder>(`${this.API_URL}/${id}/deliver`, {});
  }
}
