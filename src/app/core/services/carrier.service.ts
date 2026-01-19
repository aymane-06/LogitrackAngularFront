import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Carrier, CarrierDTO } from '../../shared/models/carrier.model';

@Injectable({
  providedIn: 'root'
})
export class CarrierService {
  private readonly API_URL = `${environment.apiUrl}/carriers`;

  constructor(private http: HttpClient) {}

  /**
   * Get all carriers
   */
  getAll(): Observable<Carrier[]> {
    return this.http.get<Carrier[]>(this.API_URL);
  }

  /**
   * Get carrier by ID
   */
  getById(id: string): Observable<Carrier> {
    return this.http.get<Carrier>(`${this.API_URL}/${id}`);
  }

  /**
   * Create new carrier (ADMIN only)
   */
  create(carrier: CarrierDTO): Observable<Carrier> {
    return this.http.post<Carrier>(this.API_URL, carrier);
  }

  /**
   * Update carrier (ADMIN only)
   */
  update(id: string, carrier: CarrierDTO): Observable<Carrier> {
    return this.http.put<Carrier>(`${this.API_URL}/${id}`, carrier);
  }

  /**
   * Delete carrier (ADMIN only)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
