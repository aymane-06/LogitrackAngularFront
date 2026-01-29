import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Supplier, SupplierDTO } from '../../shared/models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly API_URL = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  /**
   * Get all suppliers
   */
  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.API_URL);
  }

  /**
   * Get supplier by ID
   */
  getById(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.API_URL}/${id}`);
  }

  /**
   * Create new supplier (ADMIN only)
   */
  create(supplier: SupplierDTO): Observable<Supplier> {
    return this.http.post<Supplier>(this.API_URL, supplier);
  }

  /**
   * Update supplier (ADMIN only)
   */
  update(id: string, supplier: SupplierDTO): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.API_URL}/${id}`, supplier);
  }

  /**
   * Delete supplier (ADMIN only)
   */
  delete(id: string): Observable<string> {
    return this.http.delete(`${this.API_URL}/${id}`, { responseType: 'text' });
  }
}
