import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: false,
  template: `
    <div *ngIf="shouldShowError()" class="mt-1 text-sm text-red-600">
      <span *ngIf="control?.hasError('required')">{{ fieldName }} is required.</span>
      <span *ngIf="control?.hasError('email')">Please enter a valid email address.</span>
      <span *ngIf="control?.hasError('minlength')">
        {{ fieldName }} must be at least {{ control?.errors?.['minlength'].requiredLength }} characters.
      </span>
      <span *ngIf="control?.hasError('maxlength')">
        {{ fieldName }} must not exceed {{ control?.errors?.['maxlength'].requiredLength }} characters.
      </span>
      <span *ngIf="control?.hasError('min')">
        {{ fieldName }} must be at least {{ control?.errors?.['min'].min }}.
      </span>
      <span *ngIf="control?.hasError('max')">
        {{ fieldName }} must not exceed {{ control?.errors?.['max'].max }}.
      </span>
      <span *ngIf="control?.hasError('pattern')">{{ fieldName }} format is invalid.</span>
      <span *ngIf="customError">{{ customError }}</span>
    </div>
  `
})
export class FormErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() fieldName = 'This field';
  @Input() customError = '';

  shouldShowError(): boolean {
    return !!(this.control && this.control.invalid && (this.control.dirty || this.control.touched));
  }
}
