import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  template: `
    <div class="flex items-center justify-center" [ngClass]="containerClass">
      <div class="relative" [style.width.px]="size" [style.height.px]="size">
        <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <span *ngIf="message" class="ml-3 text-gray-700">{{ message }}</span>
    </div>
  `,
  styles: [`
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size = 40;
  @Input() message = '';
  @Input() containerClass = 'p-8';
}
