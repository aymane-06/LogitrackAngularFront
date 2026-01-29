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
   * Get warehouse by Code
   */
  getByCode(code: string): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.API_URL}/${code}`);
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
  update(code: string, warehouse: WarehouseDTO): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.API_URL}/${code}`, warehouse);
  }

  /**
   * Delete warehouse (ADMIN only)
   */
  delete(code: string): Observable<string> {
    return this.http.delete(`${this.API_URL}/${code}`, { responseType: 'text' });
  }
}
