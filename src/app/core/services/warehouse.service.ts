import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Warehouse, WarehouseDTO } from '../../shared/models/warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private readonly API_URL = `${environment.apiUrl}/warehouses`;

  constructor(private http: HttpClient) {}

  /**
   * Get all warehouses
   */
  getAll(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.API_URL);
  }

  /**
   * Get warehouse by ID
   */
  getById(id: string): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.API_URL}/${id}`);
  }

  /**
   * Create new warehouse (ADMIN only)
   */
  create(warehouse: WarehouseDTO): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.API_URL, warehouse);
  }

  /**
   * Update warehouse (ADMIN only)
   */
  update(id: string, warehouse: WarehouseDTO): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.API_URL}/${id}`, warehouse);
  }

  /**
   * Delete warehouse (ADMIN only)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
