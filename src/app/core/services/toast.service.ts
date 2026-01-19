import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  public toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000): void {
    const toast: Toast = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      duration
    };
    this.toastSubject.next(toast);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }
}
