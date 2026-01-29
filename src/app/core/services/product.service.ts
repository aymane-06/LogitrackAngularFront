import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductDTO } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  /**
   * Get all products
   */
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }

  /**
   * Get product by SKU
   */
  getBySku(sku: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${sku}`);
  }

  /**
   * Create new product (ADMIN only)
   */
  create(product: ProductDTO): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  /**
   * Update product (ADMIN only)
   */
  update(sku: string, product: ProductDTO): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${sku}`, product);
  }

  /**
   * Delete product (ADMIN only)
   */
  delete(sku: string): Observable<string> {
    return this.http.delete(`${this.API_URL}/${sku}`, { responseType: 'text' });
  }
}
