import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt?: string;
  passwordHash?: string;
}

@Component({
  selector: 'app-user-form-modal',
  templateUrl: './user-form-modal.html',
  styleUrls: ['./user-form-modal.css'],
  standalone: false
})
export class UserFormModal implements OnInit {
  @Input() isOpen = false;
  @Input() user?: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  userForm!: FormGroup;
  isEditMode = false;

  roles = ['ADMIN', 'WAREHOUSE_MANAGER', 'CLIENT'];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['CLIENT', Validators.required],
      active: [true],
      password: ['']
    });
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (this.user) {
      this.isEditMode = true;
      this.userForm.patchValue(this.user);
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.setValidators([Validators.minLength(8), Validators.pattern(passwordPattern)]);
    } else {
      this.isEditMode = false;
      this.userForm.reset({
        name: '',
        email: '',
        role: 'CLIENT',
        active: true,
        password: ''
      });
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8), Validators.pattern(passwordPattern)]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData: User = {
        ...formValue,
        passwordHash: formValue.password,
        ...(this.isEditMode && this.user?.id ? { id: this.user.id } : {})
      };
      // Remove passwordHash if empty
      if (!userData.passwordHash) {
        delete userData.passwordHash;
      }
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
    if (field?.hasError('pattern')) {
        return 'Password must contain uppercase, lowercase, number and a special character';
    }
    if (field?.hasError('maxlength')) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at most ${field.errors?.['maxlength'].requiredLength} characters`;
    }
    return '';
  }
}
