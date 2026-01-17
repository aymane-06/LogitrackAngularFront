import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Inventory, InventoryDTO } from '../../shared/models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly API_URL = `${environment.apiUrl}/inventories`;

  constructor(private http: HttpClient) {}

  /**
   * Get all inventory records
   */
  getAll(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.API_URL);
  }

  /**
   * Get inventory by warehouse ID
   */
  getByWarehouse(warehouseId: string): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.API_URL}/warehouse/${warehouseId}`);
  }

  /**
   * Get inventory by product ID
   */
  getByProduct(productId: string): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.API_URL}/product/${productId}`);
  }

  /**
   * Create inventory record
   */
  create(inventory: InventoryDTO): Observable<Inventory> {
    return this.http.post<Inventory>(this.API_URL, inventory);
  }

  /**
   * Update inventory
   */
  update(id: string, inventory: InventoryDTO): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.API_URL}/${id}`, inventory);
  }
}
