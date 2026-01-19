import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt?: string;
}

@Component({
  selector: 'app-user-form-modal',
  templateUrl: './user-form-modal.html',
  styleUrls: ['./user-form-modal.css'],
  standalone: false
})
export class UserFormModal implements OnInit {
  @Input() isOpen = false;
  @Input() user?: User;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  userForm!: FormGroup;
  isEditMode = false;

  roles = ['ADMIN', 'WAREHOUSE_MANAGER', 'CLIENT'];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['CLIENT', Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.user) {
      this.isEditMode = true;
      this.userForm.patchValue(this.user);
    } else {
      this.isEditMode = false;
      this.userForm.reset({
        name: '',
        email: '',
        role: 'CLIENT',
        active: true
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData: User = {
        ...formValue,
        ...(this.isEditMode && this.user?.id ? { id: this.user.id } : {})
      };
      this.save.emit(userData);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Invalid email format';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
