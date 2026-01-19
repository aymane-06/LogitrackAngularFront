import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast, ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrls: ['./toast.css'],
  standalone: false
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription!: Subscription;
  private timeouts: Map<string, any> = new Map();

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toast$.subscribe((toast) => {
      this.toasts = [...this.toasts, toast];
      this.cdr.markForCheck();

      // Auto-remove toast after duration
      if (toast.duration && toast.duration > 0) {
        const timeoutId = setTimeout(() => {
          this.removeToast(toast.id);
        }, toast.duration);
        this.timeouts.set(toast.id, timeoutId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // Clear all timeouts
    this.timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.timeouts.clear();
  }

  removeToast(id: string): void {
    // Check if toast exists before removing
    const toastIndex = this.toasts.findIndex(t => t.id === id);
    if (toastIndex === -1) {
      return;
    }
    
    // Clear the timeout if it exists
    const timeoutId = this.timeouts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(id);
    }
    
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.cdr.markForCheck();
  }
}
