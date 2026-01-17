import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserDTO } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get all users (ADMIN only)
   */
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  /**
   * Get user by ID
   */
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  /**
   * Create new user (ADMIN only)
   */
  create(user: UserDTO): Observable<User> {
    return this.http.post<User>(this.API_URL, user);
  }

  /**
   * Update user (ADMIN only)
   */
  update(id: string, user: UserDTO): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, user);
  }

  /**
   * Delete user (ADMIN only)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
