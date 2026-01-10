import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../shared/models/user.model';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';
  roles = [
    { value: UserRole.CLIENT, label: 'Client' },
    { value: UserRole.WAREHOUSE_MANAGER, label: 'Warehouse Manager' },
    { value: UserRole.ADMIN, label: 'Admin' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.authService.navigateToDashboard();
      return;
    }

    // Create reactive form
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.CLIENT, [Validators.required]]
    });
  }

  // Getter for easy access to form controls
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    // Clear previous error
    this.errorMessage = '';

    // Validate form
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    // Call auth service
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        // Navigate based on user role
        this.authService.navigateToDashboard();
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
